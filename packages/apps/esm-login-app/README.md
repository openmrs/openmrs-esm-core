# openmrs-esm-login-app

openmrs-esm-login-app is responsible for rendering the loading page, the login page, and the location picker.

## Configuration

The login page can be customized through configuration. This allows implementers to:

- Position the login form (left, center, or right)
- Customize backgrounds with solid colors or images
- Brand the login page with custom titles, subtitles, and help text (supports translation keys)
- Configure the logo and footer
- Control the location picker behavior

See the [configuration schema](src/config-schema.ts) for all available options.

## Configuration Options

### Layout

- **`loginFormPosition`**: Position of the login form on the screen (`'left'` | `'center'` | `'right'`)
  - Default: `'center'`
- **`showFooter`**: Whether to show the footer on the login page
  - Default: `true`

### Background

- **`color`**: Solid background color (e.g., `"#0071C5"`, `"blue"`, `"rgb(0,113,197)"`)
  - Default: `''` (uses theme default)
- **`imageUrl`**: URL to background image (e.g., `"https://example.com/bg.jpg"`)
  - Default: `''` (no image)
  - Images are automatically displayed with `cover` sizing, `center` positioning, and `no-repeat`

### Branding

- **`title`**: Custom title text or translation key (e.g., `"welcome.title"`)
  - Default: `''`
- **`subtitle`**: Custom subtitle text or translation key (e.g., `"welcome.subtitle"`)
  - Default: `''`
- **`helpText`**: Custom help text or translation key for support information
  - Default: `''`

**Note**: All branding text fields support translation keys for internationalization.

## Configuration Examples

### Background with Solid Color

```json
{
  "@openmrs/esm-login-app": {
    "background": {
      "color": "#0071C5"
    }
  }
}
```

### Background with Image

```json
{
  "@openmrs/esm-login-app": {
    "background": {
      "imageUrl": "https://example.com/hospital-background.jpg"
    }
  }
}
```

### Positioned Login Form with Branding

```json
{
  "@openmrs/esm-login-app": {
    "layout": {
      "loginFormPosition": "left",
      "showFooter": true
    },
    "branding": {
      "title": "Welcome to My Clinic",
      "subtitle": "Electronic Medical Records System",
      "helpText": "For assistance, contact IT support"
    }
  }
}
```

### Complete Configuration Example

```json
{
  "@openmrs/esm-login-app": {
    "layout": {
      "loginFormPosition": "center",
      "showFooter": true
    },
    "background": {
      "color": "#f0f4f8",
      "imageUrl": "https://example.com/clinic-bg.jpg"
    },
    "branding": {
      "title": "welcome.title",
      "subtitle": "welcome.subtitle",
      "helpText": "support.helpText"
    },
    "logo": {
      "src": "https://example.com/logo.png",
      "alt": "My Clinic Logo"
    }
  }
}
```