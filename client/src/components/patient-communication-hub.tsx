import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Bell, Calendar, Settings, Send, Clock, Copy, FileText, Pill, Heart, CreditCard, Stethoscope, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

// Message templates data
const MESSAGE_TEMPLATES = [
  {
    id: 'appointment-reminder',
    name: 'Appointment Reminder',
    category: 'appointment',
    icon: Calendar,
    content: `Dear {patientName},

This is a friendly reminder about your upcoming appointment scheduled for {appointmentDate} at {appointmentTime}.

Please arrive 15 minutes early to complete any necessary paperwork. If you need to reschedule, please contact us at least 24 hours in advance.

We look forward to seeing you!

Best regards,
{clinicName}`
  },
  {
    id: 'lab-results',
    name: 'Lab Results Ready',
    category: 'lab_result',
    icon: FileText,
    content: `Dear {patientName},

Your recent lab results are now available. Please log into your patient portal to view them, or contact our office to schedule a follow-up appointment with your healthcare provider.

If you have any questions about your results, please don't hesitate to reach out.

Best regards,
{clinicName}`
  },
  {
    id: 'prescription-refill',
    name: 'Prescription Refill Reminder',
    category: 'treatment_plan',
    icon: Pill,
    content: `Dear {patientName},

This is a reminder that your prescription for {medicationName} is due for a refill. Please contact our office or visit your pharmacy to ensure you don't run out of your medication.

If you have any questions or need to discuss your treatment plan, please schedule an appointment with your healthcare provider.

Best regards,
{clinicName}`
  },
  {
    id: 'follow-up',
    name: 'Follow-up Visit Request',
    category: 'appointment',
    icon: Stethoscope,
    content: `Dear {patientName},

We hope you're doing well. It's time for your follow-up visit to review your progress and discuss your ongoing care.

Please contact our office to schedule your next appointment at your earliest convenience.

We look forward to seeing you soon!

Best regards,
{clinicName}`
  },
  {
    id: 'health-tips',
    name: 'General Health Tips',
    category: 'general',
    icon: Heart,
    content: `Dear {patientName},

Here are some helpful health tips for this season:

• Stay hydrated by drinking plenty of water
• Maintain a balanced diet rich in fruits and vegetables
• Get regular exercise - aim for at least 30 minutes daily
• Ensure adequate sleep (7-9 hours for adults)
• Schedule your annual check-up

If you have any health concerns, please don't hesitate to contact us.

Best regards,
{clinicName}`
  },
  {
    id: 'payment-reminder',
    name: 'Payment Reminder',
    category: 'general',
    icon: CreditCard,
    content: `Dear {patientName},

This is a friendly reminder regarding your outstanding balance of {amountDue}. 

Please log into your patient portal to make a payment, or contact our billing department if you have any questions or would like to discuss payment options.

Thank you for your prompt attention to this matter.

Best regards,
{clinicName}`
  }
];

interface Message {
  id: number;
  patientId: number;
  senderId: number;
  senderName: string;
  senderRole: string;
  content: string;
  messageType: 'general' | 'appointment' | 'lab_result' | 'treatment_plan';
  isRead: boolean;
  priority: 'low' | 'normal' | 'high';
  createdAt: string;
}

interface AppointmentReminder {
  id: number;
  patientId: number;
  appointmentDate: string;
  doctorName: string;
  type: string;
  status: 'pending' | 'sent' | 'confirmed' | 'cancelled';
  reminderSent: boolean;
}

interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
}

export function PatientCommunicationHub({ patientId }: { patientId?: number }) {
  const [selectedPatient, setSelectedPatient] = useState<number | null>(patientId || null);
  const [newMessage, setNewMessage] = useState('');
  const [messageType, setMessageType] = useState<'general' | 'appointment' | 'lab_result' | 'treatment_plan'>('general');
  const [priority, setPriority] = useState<'low' | 'normal' | 'high'>('normal');
  const [communicationPrefs, setCommunicationPrefs] = useState({
    email: 'enabled',
    sms: 'enabled',
    phone: 'disabled'
  });
  const [activeTab, setActiveTab] = useState('messages');
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch patients for selection
  const { data: patients = [] } = useQuery({
    queryKey: ['/api/patients'],
    enabled: !patientId
  });

  // Fetch messages for selected patient
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ['/api/messages', selectedPatient],
    enabled: !!selectedPatient
  });

  // Fetch appointment reminders
  const { data: reminders = [] } = useQuery({
    queryKey: ['/api/appointment-reminders', selectedPatient],
    enabled: !!selectedPatient
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: (messageData: any) => apiRequest('/api/messages', 'POST', messageData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/messages', selectedPatient] });
      setNewMessage('');
      toast({
        title: "Message Sent",
        description: "Your message has been sent successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Send appointment reminder mutation
  const sendReminderMutation = useMutation({
    mutationFn: (reminderData: any) => apiRequest('/api/appointment-reminders', 'POST', reminderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/appointment-reminders', selectedPatient] });
      toast({
        title: "Reminder Sent",
        description: "Appointment reminder has been sent to the patient.",
      });
    }
  });

  // Mark message as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: (messageId: number) => apiRequest(`/api/messages/${messageId}/read`, 'PATCH'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/messages', selectedPatient] });
    }
  });

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedPatient) return;

    const messageData = {
      patientId: selectedPatient,
      content: newMessage,
      messageType,
      priority,
      senderRole: 'staff'
    };

    sendMessageMutation.mutate(messageData);
  };

  const handleSendReminder = (appointmentId: number) => {
    sendReminderMutation.mutate({ appointmentId, patientId: selectedPatient });
  };

  const handlePreferenceUpdate = (method: string, preference: string) => {
    const newPrefs = { ...communicationPrefs, [method]: preference };
    setCommunicationPrefs(newPrefs);
    
    toast({
      title: "Preferences Updated",
      description: `${method.toUpperCase()} notifications ${preference}`,
    });
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'appointment': return <Calendar className="w-4 h-4" />;
      case 'lab_result': return <Bell className="w-4 h-4" />;
      case 'treatment_plan': return <Settings className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleUseTemplate = (template: typeof MESSAGE_TEMPLATES[0]) => {
    setNewMessage(template.content);
    setMessageType(template.category as any);
    setActiveTab('messages');
    toast({
      title: "Template Applied",
      description: `${template.name} template has been loaded into the message editor.`,
    });
  };

  const handleCopyTemplate = async (template: typeof MESSAGE_TEMPLATES[0]) => {
    try {
      await navigator.clipboard.writeText(template.content);
      setCopiedTemplate(template.id);
      toast({
        title: "Template Copied",
        description: `${template.name} template copied to clipboard.`,
      });
      setTimeout(() => setCopiedTemplate(null), 2000);
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Could not copy template to clipboard.",
        variant: "destructive"
      });
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'appointment': return 'bg-blue-100 text-blue-800';
      case 'lab_result': return 'bg-purple-100 text-purple-800';
      case 'treatment_plan': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'appointment': return 'Appointment';
      case 'lab_result': return 'Lab Result';
      case 'treatment_plan': return 'Treatment';
      default: return 'General';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Card className="healthcare-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Patient Communication Hub
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="reminders">Reminders</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>

            {/* Messages Tab */}
            <TabsContent value="messages" className="space-y-4">
              {!patientId && (
                <div className="space-y-2">
                  <Label htmlFor="patient-select">Select Patient</Label>
                  <Select value={selectedPatient?.toString() || ''} onValueChange={(value) => setSelectedPatient(parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(patients) && patients.map((patient: Patient) => (
                        <SelectItem key={patient.id} value={patient.id.toString()}>
                          {patient.firstName} {patient.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedPatient && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Message History */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Message History</h3>
                    <ScrollArea className="h-96 border rounded-lg p-4">
                      {messagesLoading ? (
                        <div className="text-center py-8">Loading messages...</div>
                      ) : Array.isArray(messages) && messages.length > 0 ? (
                        <div className="space-y-3">
                          {messages.map((message: Message) => (
                            <div
                              key={message.id}
                              className={`p-3 rounded-lg border-l-4 ${
                                message.isRead ? 'bg-gray-50 border-l-gray-300' : 'bg-blue-50 border-l-blue-500'
                              }`}
                              onClick={() => !message.isRead && markAsReadMutation.mutate(message.id)}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  {getMessageIcon(message.messageType)}
                                  <span className="font-medium text-sm">{message.senderName}</span>
                                  <Badge variant="outline" className="text-xs">{message.senderRole}</Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge className={`text-xs ${getPriorityColor(message.priority)}`}>
                                    {message.priority}
                                  </Badge>
                                  {!message.isRead && <Bell className="w-3 h-3 text-blue-500" />}
                                </div>
                              </div>
                              <p className="text-sm text-gray-700 mb-2">{message.content}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(message.createdAt).toLocaleString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">No messages found</div>
                      )}
                    </ScrollArea>
                  </div>

                  {/* Send New Message */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Send New Message</h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="message-type">Message Type</Label>
                        <Select value={messageType} onValueChange={(value: any) => setMessageType(value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General</SelectItem>
                            <SelectItem value="appointment">Appointment</SelectItem>
                            <SelectItem value="lab_result">Lab Result</SelectItem>
                            <SelectItem value="treatment_plan">Treatment Plan</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message-content">Message Content</Label>
                      <p className="text-sm text-muted-foreground">
                        Messages are personalized based on patient appointment and visit data.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message-content">Message</Label>
                      <Textarea
                        id="message-content"
                        placeholder="Type your message here..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        rows={4}
                      />
                    </div>

                    <Button 
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || sendMessageMutation.isPending}
                      className="w-full"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {sendMessageMutation.isPending ? 'Sending...' : 'Send Message'}
                    </Button>
                  </div>
                </div>
              )}

              {!selectedPatient && (
                <div className="text-center py-8 text-gray-500">Select a patient to view and send messages</div>
              )}
            </TabsContent>

            {/* Reminders Tab */}
            <TabsContent value="reminders" className="space-y-4">
              <h3 className="text-lg font-semibold">Appointment Reminders</h3>
              
              {selectedPatient ? (
                <div className="space-y-3">
                  {Array.isArray(reminders) && reminders.length > 0 ? (
                    reminders.map((reminder: AppointmentReminder) => (
                      <Card key={reminder.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span className="font-medium">
                                {new Date(reminder.appointmentDate).toLocaleDateString()} - Dr. {reminder.doctorName}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{reminder.type}</p>
                            <Badge variant={reminder.status === 'sent' ? 'default' : 'outline'}>
                              {reminder.status}
                            </Badge>
                          </div>
                          <Button
                            onClick={() => handleSendReminder(reminder.id)}
                            disabled={reminder.reminderSent || sendReminderMutation.isPending}
                            size="sm"
                          >
                            {reminder.reminderSent ? 'Sent' : 'Send Reminder'}
                          </Button>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">No upcoming appointments</div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">Select a patient to view reminders</div>
              )}
            </TabsContent>

            {/* Templates Tab */}
            <TabsContent value="templates" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Message Templates</h3>
                  <p className="text-sm text-muted-foreground">
                    Select a template to quickly compose messages. Use placeholders like {'{patientName}'} for personalization.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {MESSAGE_TEMPLATES.map((template) => {
                  const IconComponent = template.icon;
                  const isCopied = copiedTemplate === template.id;
                  
                  return (
                    <Card key={template.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <IconComponent className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-sm font-medium">{template.name}</CardTitle>
                              <Badge variant="outline" className={`text-xs mt-1 ${getCategoryColor(template.category)}`}>
                                {getCategoryLabel(template.category)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-xs text-muted-foreground line-clamp-3 mb-4">
                          {template.content.substring(0, 120)}...
                        </p>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleCopyTemplate(template)}
                          >
                            {isCopied ? (
                              <>
                                <Check className="h-3 w-3 mr-1" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3 mr-1" />
                                Copy
                              </>
                            )}
                          </Button>
                          <Button 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleUseTemplate(template)}
                          >
                            <Send className="h-3 w-3 mr-1" />
                            Use
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-4">
              <h3 className="text-lg font-semibold">Notification Settings</h3>
              
              <div className="space-y-4">
                <Card className="p-4">
                  <h4 className="font-medium mb-3">Communication Preferences</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(communicationPrefs).map(([method, preference]) => (
                      <div key={method} className="space-y-2">
                        <Label className="text-sm font-medium capitalize">{method}</Label>
                        <Select 
                          value={preference} 
                          onValueChange={(value) => handlePreferenceUpdate(method, value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="enabled">Enabled</SelectItem>
                            <SelectItem value="disabled">Disabled</SelectItem>
                            <SelectItem value="urgent-only">Urgent Only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-medium mb-3">Auto-Reminder Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Appointment reminders (24h before)</span>
                      <Badge variant="outline">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Lab result notifications</span>
                      <Badge variant="outline">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Prescription refill reminders</span>
                      <Badge variant="outline">Active</Badge>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}