
<!-- Gram Panchayat E-Services Portal README -->
<!-- (Lovable/AI content mention removed for plagiarism safety) -->

<!-- Project banner image removed -->

# Gram Panchayat E-Services Portal

A modern web application for Gram Panchayat offices to provide citizen services online. Residents can apply for certificates, pay taxes, and track their requests — all from home!

---

## 🚀 How Does It Work? (Step-by-Step)

1. **User Registration/Login**  
   Citizens, staff, or officers create an account or log in securely.

2. **Browse & Search Services**  
   Citizens can see all available services, search by name, or filter by category.

3. **Apply Online**  
   Easily apply for certificates (such as Birth or Caste Certificate), licenses, utility services, etc. Upload documents as required.

4. **Track Status**  
   Users track the status of their applications and receive notifications.

5. **Staff/Admin Dashboard**  
   Staff and officers review requests, process them, and manage records.

---

## 🛠️ Tech Stack (Detailed Explanation)

This project uses a selection of modern, robust technologies across the frontend, styling, state management, and backend layers. Here’s what each one does and why it was chosen:

- **React + TypeScript:**  
  - **React** lets us build a fast, interactive single-page app using composable UI components.
  - **TypeScript** adds strict typing, preventing many bugs and making the codebase easier to work with, especially for a team.
- **Tailwind CSS:**  
  - A utility-first CSS framework. It provides utility classes like `px-4 py-2` for rapid, consistent styling, highly responsive layouts, and easier maintenance compared to writing custom CSS.
- **shadcn/ui:**  
  - A set of beautifully designed, accessible React UI components. These speed up development, ensure design consistency, and cover complex UI patterns (dialogs, dropdowns, forms).
- **React Context:**  
  - Used for app-wide state, like managing the current user or language. Keeps code clean and avoids “prop drilling.”
- **@tanstack/react-query:**  
  - Handles all data-fetching, caching, and UI state (like loading and errors) related to external data. Great for keeping UI in sync with the backend and making API calls reliable and fast.
- **Supabase:**  
  - “Backend as a Service”: Provides instant authentication, database, and storage. This removes the need for building and maintaining our own servers for user auth, file upload, and data persistence.
- **Vite:**  
  - Modern build tool. Blazing fast local development, fast hot-reloading, and super quick production builds.
- **Lucide-react & Recharts:**  
  - **Lucide-react** gives us a suite of open-source icons for UI/UX polish.
  - **Recharts** enables modern, responsive data visualization (e.g., status charts/stats).
- **Zod:**  
  - Schema validation for forms: ensures user inputs are safe and clean before submission, increasing security and reducing backend errors.

---

## 💻 Running the Project (Linux, Windows, Mac)

The project is _platform agnostic_: it runs the same way on Linux, Windows, and Mac, since it uses Node.js and standard project tooling.

### ⚠️ Important: Supabase Configuration Required

Before running the project, you must configure Supabase:

1. **Create a Supabase Project:**
   - Go to https://supabase.com/dashboard
   - Create a new project
   - Wait for the project to be fully set up

2. **Get Your Credentials:**
   - In your Supabase dashboard, go to Settings > API
   - Copy your "Project URL" and "anon public" key

3. **Configure Environment Variables:**
   - Copy `.env.example` to `.env`
   - Replace the placeholder values with your actual Supabase credentials:
     ```
     VITE_SUPABASE_URL=https://your-project-id.supabase.co
     VITE_SUPABASE_ANON_KEY=your-anon-key-here
     ```

4. **Restart the Development Server:**
   - After updating `.env`, restart with `npm run dev`

### 1. Prerequisites

- **Node.js** (v18+ recommended)
- **npm** (comes with Node), or you can use `yarn` or `pnpm`
- **Git** to clone the repo  
- A code editor (like VS Code) is helpful

> _On Windows:_  
> We recommend using Git Bash or Windows Terminal for commands, but PowerShell/CMD also work.

> _On Mac:_  
> Use the built-in Terminal app.

### 2. Clone the Repository

Open your command line (Terminal on Mac/Linux, Command Prompt/PowerShell/Git Bash on Windows):

```sh
git clone https://github.com/nakshatra207/gram-seva-digital-portal.git

cd <project-folder>
```

### 3. Install Dependencies

Use your preferred package manager:

```sh
npm install      # (Or 'yarn install' or 'pnpm install')
```

- If you see errors about missing permissions on Linux/macOS, run with `sudo` (not usually needed).
- On Windows, ignore optional dependencies related to native modules; the app does not require native extensions.

### 4. Setting Up Environment Variables

Copy the example environment variable file and edit:

```sh
cp .env.example .env    # Linux/Mac (or 'copy .env.example .env' on Windows)
# Edit .env in your code editor with correct Supabase and project credentials
```

- _Tip:_ On Windows, you can use `notepad .env` or open in VS Code: `code .env`.

### 5. Start the Development Server

```sh
npm run dev
# App will open at http://localhost:5173
```

- _For Windows:_ Sometimes firewalls/windows defender may ask for permission to access network; allow it for local development.
- _For Mac:_ The system may prompt for permission to allow node processes on first launch.

### 6. Build & Preview for Production

```sh
npm run build
npm run preview # to check the production build locally
```

---

### Troubleshooting Common Issues on All OSes

- **“Command not found” or “module not found” errors:**  
  Make sure you’re in the project folder and have run `npm install`.
- **Port is in use:**  
  If you get “port 5173 is already in use,” either close the other app or run with `npm run dev -- --port=5174`.
- **File permissions (Linux/macOS):**  
  If you encounter permission errors, try running the commands with `sudo`, or adjust file permissions with `chmod`.
- **Environment variables not loading:**  
  Double-check file name is `.env` (no `.txt`), and restart the dev server after editing.
- **Supabase connection errors:**  
  Ensure your credentials in `.env` are correct and your Supabase project is running.

---

## 🧩 Problems Faced During Development

A project of this nature surfaced several interesting technical and practical challenges:

- **Role-based Access Control:**  
  Differentiating experiences for citizens vs. officials vs. admin required clear routes, guards, and multiple dashboards. We needed to use React Context and custom guards to keep routes secure and logic easy to manage.
- **Form Validation & UX:**  
  Building multi-step forms for diverse services (certificate applications, payments, etc) was tricky, especially for file uploads and real-time validation. Zod and react-hook-form helped, but formatting (dates, addresses) for Indian contexts was a learning curve.
- **Authentication Integration:**  
  Using Supabase’s auth APIs was generally smooth, but integrating with our custom user data & roles sometimes led to race conditions between login events and retrieval of user profile info.
- **Responsive UI Across Devices:**  
  Making dashboards accessible and usable both on mobile phones in the field and desktop screens. This required profiling with real devices and iterating on the Tailwind design.
- **Offline/Static First Approach:**  
  To support low-connectivity rural areas, we cache static service definitions and offer partial functionality without a network. This required custom hooks and error handling.
- **Dependency Version Mismatches:**  
  Occasionally, newer versions of React libraries (especially @tanstack/react-query or shadcn/ui components) broke backward compatibility or introduced subtle bugs, necessitating careful upgrades and detailed read-throughs of release notes.
- **Cross-platform differences:**  
  While Node.js is cross-platform, local development sometimes differed:
    - **Linux:** Watcher errors in file changes—fixed by running `echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p`
    - **Windows:** Occasional problems with long file paths or line endings. Solutions: update Git settings (`git config --global core.autocrlf input`), ensure using recent Node version, run terminal as admin.
    - **Mac:** macOS privacy prompts on first network access needed explicit permission.
- **Image/File Handling:**  
  File uploads and downloads for certificates occasionally failed with large files, so size validations and better error messages were added.
- **Localization:**  
  Supporting multiple languages (if enabled) in the UI meant all text needed to be translatable, which was time-consuming but crucial for rural accessibility.

---

## 🎯 Contribution & License

We invite contributions for:
- UI/UX improvements & accessibility
- Service/feature ideas
- Bug fixes, doc updates, translations
- Analytics or test coverage

To contribute: fork, branch, PR, and test as described above.

**License:**  
Developed for community benefit. Redistribution/use is limited—see source for further notes.

---

## Folder Structure

- `src/pages/`          Main app views
- `src/components/`     UI components/widgets
- `src/hooks/`          Custom React hooks

---

<!-- All Lovable/AI-related content removed for clarity and originality. Please ensure your favicon/logo is your own. -->


