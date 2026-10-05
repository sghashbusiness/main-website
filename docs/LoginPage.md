# 🌌 Login & Authentication

The **Login Module** serves as the secure entry point to the SGHASH ONE Retail OS. It utilizes a premium 3D flipping glassmorphic card interface set against a deep-space animated background.

## 🎛️ Interface Elements

| Element | Type | Description & Functionality |
| :--- | :--- | :--- |
| **Ambient Canvas** | Background | Deep space radial gradient with slow-moving floating stars. Sets the premium aesthetic. |
| **Authentication Card** | Container | Frosted glass panel (`backdrop-filter: blur(24px)`) hosting the forms. |
| **SGHASH ONE Logo** | Branding | Automatically inverted crisp white logo. |
| **"Username or Email"** | Ghost Input | Primary identifier field. Auto-focuses on load. Features a user icon. |
| **"Enter your password"** | Ghost Input | Secure password field. Features a lock icon. |

## 🕹️ Interactive Controls

### 1. Login Flow (Front Card)
* **`[Forgot password?]` (Text Link)** 
  * **Action**: Triggers a smooth 3D flip animation.
  * **Result**: Reveals the Password Recovery form on the back of the card.
* **`[Submit →]` (Primary Pill Button)**
  * **State: Disabled**: If either identifier or password fields are empty.
  * **State: Active**: When both fields are populated.
  * **Action**: Submits credentials to the server.
  * **Result**: Displays "Processing..." state. On success, routes the user to their designated workspace (e.g., Dashboard).

### 2. Recovery Flow (Back Card)
* **`[Recovery Input]` (Ghost Input)**
  * **Action**: Accepts registered email or phone for reset link delivery.
* **`[Send Reset Link]` (Primary Pill Button)**
  * **Action**: Dispatches recovery instructions to the user.
* **`[Cancel]` (Secondary Outline Button)**
  * **Action**: Triggers a reverse 3D flip animation.
  * **Result**: Returns the user to the Login Flow without submitting.

## 🔄 Navigation & Routing Rules
* **Authenticated Redirection**: If a user with a valid active session navigates to `/login`, they are instantly redirected to their role's default landing page (e.g., Owners to `/dashboard`).
