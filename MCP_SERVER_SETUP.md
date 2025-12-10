# MCP Server Setup Guide

## Overview

MCP (Model Context Protocol) servers have been configured to enable AI-powered features directly in your IDE. This allows the AI assistant to interact with your filesystem, database, GitHub, and more.

## Installed MCP Servers

### 1. **Filesystem Server** ✅
- **Purpose**: Read and write files in your project directory
- **Status**: Ready to use
- **Location**: `/Users/lacbis/Documents/GitHub/clinicconnect-2`

### 2. **PostgreSQL Server** ✅
- **Purpose**: Query and manage your PostgreSQL database
- **Status**: Configured with your local database
- **Connection**: `postgresql://clinicuser:clinic_dev_2024@localhost:5434/clinicconnect`
- **Note**: Ensure your Docker database container is running

### 3. **GitHub Server** ⚠️
- **Purpose**: Interact with GitHub repositories, create issues, manage PRs
- **Status**: Requires API token
- **Setup**: Add your GitHub Personal Access Token to `~/.cursor/mcp.json`

### 4. **Brave Search Server** ⚠️
- **Purpose**: Search the web using Brave Search API
- **Status**: Requires API key
- **Setup**: Add your Brave API key to `~/.cursor/mcp.json`

### 5. **Puppeteer Server** ✅
- **Purpose**: Browser automation and web scraping
- **Status**: Ready to use

## Configuration File

The MCP servers are configured in: `~/.cursor/mcp.json`

## Setup Instructions

### 1. Restart Cursor IDE
After configuration, restart Cursor IDE to load the MCP servers:
- **macOS**: `Cmd + Q` to quit, then reopen Cursor
- **Windows/Linux**: Close and reopen Cursor

### 2. Optional: Add GitHub Token

To enable GitHub integration:

1. Create a GitHub Personal Access Token:
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Select scopes: `repo`, `read:org`, `read:user`
   - Copy the token

2. Update `~/.cursor/mcp.json`:
   ```json
   "github": {
     "env": {
       "GITHUB_PERSONAL_ACCESS_TOKEN": "your-token-here"
     }
   }
   ```

3. Restart Cursor IDE

### 3. Optional: Add Brave Search API Key

To enable web search:

1. Get a Brave Search API key:
   - Visit: https://brave.com/search/api/
   - Sign up and get your API key

2. Update `~/.cursor/mcp.json`:
   ```json
   "brave-search": {
     "env": {
       "BRAVE_API_KEY": "your-api-key-here"
     }
   }
   ```

3. Restart Cursor IDE

## Usage

Once configured, the AI assistant can:

- ✅ **Read/Write Files**: Access and modify files in your project
- ✅ **Database Queries**: Query your PostgreSQL database directly
- ✅ **GitHub Operations**: Create issues, manage PRs, read repository info
- ✅ **Web Search**: Search the internet for documentation and solutions
- ✅ **Browser Automation**: Test your application in a browser

## Verify Installation

After restarting Cursor, you can verify MCP servers are working by:

1. Opening the Cursor command palette (`Cmd+Shift+P` / `Ctrl+Shift+P`)
2. Looking for MCP-related commands
3. The AI assistant should be able to use these servers automatically

## Troubleshooting

### MCP Servers Not Loading

1. **Check Configuration**: Verify `~/.cursor/mcp.json` is valid JSON
2. **Check Permissions**: Ensure Cursor has access to the project directory
3. **Check Database**: For PostgreSQL server, ensure Docker container is running:
   ```bash
   docker ps | grep clinicconnect-postgres
   ```

### Database Connection Issues

If the PostgreSQL MCP server can't connect:

1. Verify database is running:
   ```bash
   docker start clinicconnect-postgres
   ```

2. Test connection:
   ```bash
   psql postgresql://clinicuser:clinic_dev_2024@localhost:5434/clinicconnect
   ```

3. Update connection string in `~/.cursor/mcp.json` if needed

### Server Installation Issues

MCP servers are installed on-demand using `npx`. If you encounter issues:

1. Check internet connection (servers download on first use)
2. Verify Node.js and npm are installed:
   ```bash
   node --version
   npm --version
   ```

## Next Steps

1. **Restart Cursor IDE** to load the MCP servers
2. **Test the integration** by asking the AI assistant to:
   - Read a file from your project
   - Query your database
   - Search for documentation
3. **Add API keys** for GitHub and Brave Search if needed

## Security Notes

- ⚠️ The MCP configuration file contains database credentials
- ⚠️ Keep `~/.cursor/mcp.json` secure and don't commit it to git
- ⚠️ Use environment variables for sensitive data in production

---

**Configuration Date**: December 9, 2024  
**Project**: ClinicConnect Healthcare Management System

