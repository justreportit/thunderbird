# Just Report It Thunderbird Plugin

## Introduction ##

Just Report It (<https://justreport.it>) is an email plugin which makes it easy to report spam emails back to the domain registrar. This method ensures that spam domains are effetively being blocked at the registrar level and not just locally.

## Custom Setup ##

To run this plugin locally, you will need to run your own Just Report It server and update the api key value (x-api-key) found in the "background.js" file.

## Enterprise Policy Support ##

Just Report It supports Thunderbird Enterprise Policies, allowing administrators to centrally manage extension settings. When settings are managed via policy, they override user preferences and the settings UI is disabled for those options.

### Setting up Enterprise Policies ###

On Windows, create a directory called 'distribution' where Thunderbird's EXE file is located and place a policies.json with the following structure:

```json
{
  "policies": {
    "3rdparty": {
      "Extensions": {
        "admin@justreport.it": {
          "mode": "registrar",
          "action": "move",
          "trim": true,
          "extension": "eml",
          "whois": "https://whois.com/whois/",
          "server": "https://api.justreport.it/lookup/",
          "api-key": "your-api-key-here",
          "spamcop": "your-spamcop-id-here",
          "custom": [],
          "messageSource": "locales",
          "customTitle": "Spam Report",
          "customBody": "This is a spam report from our organization."
        }
      }
    }
  }
}
```

### Available Policy Settings ###

- **mode**: `"registrar"`, `"spamcop"`, `"custom"`, `"spamcop_and_custom"`, or `"all"`
- **action**: `"leave"`, `"move"`, or `"delete"`
- **trim**: `true` or `false` (trim messages to 50KB)
- **extension**: `"eml"` or `"txt"`
- **whois**: WHOIS URL (e.g., `"https://whois.com/whois/"` or `""` for none)
- **server**: Custom abuse lookup server URL
- **api-key**: API key for the lookup server
- **spamcop**: SpamCop email address (e.g., `"submit.xxxxx@spam.spamcop.net"`)
- **custom**: Array of custom email addresses for reports
- **messageSource**: `"locales"`, `"english"`, or `"custom"`
- **customTitle**: Custom email subject (when messageSource is "custom")
- **customBody**: Custom email body (when messageSource is "custom")

Any settings defined in the policy will override user preferences and appear as locked in the options interface with an "Enterprise Managed" indicator.