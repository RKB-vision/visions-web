# AI Portfolio Webpage

Welcome to your new AI Portfolio webpage! This is a professional, single-page website designed to showcase your AI projects in a clean, modern interface inspired by Apple's design language.

This project is built using only **HTML, CSS, and JavaScript**. There is no backend server or database. All data (users, survey responses, favorites) is managed in your browser's local storage, making it perfect for a personal portfolio or a demonstration.

## Features

### 👤 User Features
* **Modern Design**: A clean, minimalist aesthetic with professional typography and spacing.
* **Project Showcase**: A grid-based layout to display your AI projects with titles, descriptions, and tags.
* **Login/Logout System**: Users can log in to access personalized features. The session is maintained until the browser tab is closed.
* **Favorite Projects**: Logged-in users can mark projects as their favorites, with the choice saved to their profile.
* **Feedback Survey**: A pre-defined survey allows users to provide feedback on the projects and website design.
* **Social Profile Section**: A dedicated area to link to your GitHub, LinkedIn, Twitter, or other social profiles.
* **Trusted Chat System**: A special chat widget appears for users who are marked as "TRUSTED" by the admin.

### 👑 Admin Features
* **Admin Dashboard**: A special panel that is only visible to users logged in as an admin.
* **View Survey Responses**: The admin can see all submitted survey responses, including the username of the person who submitted them.
* **User Management**: The admin can view a list of all users.
* **Assign Special Tags**: Admins can assign predefined tags like "TOP SUPPORTER" to users.
* **Grant "TRUSTED" Status**: Admins can toggle a user's "TRUSTED" status, which grants them access to the site's chat system.

## How to Customize (Admin Guide)

As the site owner, you can easily customize the content directly in the `script.js` file.

### 1. Adding Your Projects

To add, edit, or remove a project, open `script.js` and find the `projectsData` array near the top of the file.

Each project is a JavaScript object with the following structure:
```javascript
{
    id: 'proj4', // A unique ID for the project
    title: 'Your New Project Title',
    description: 'A brief description of what your project does and the technology used.',
    tags: ['Tag1', 'Tag2', 'New Technology'] // Add relevant tags
}
```
Simply add a new object to the array to display a new project on the site.

### 2. Managing Users

To pre-define users, open `script.js` and find the `initialUsers` array. You can add new user objects or modify the existing ones.

* **To create an admin**, set `isAdmin: true`.
* **The default admin login is:** `username: admin`, `password: password123`. **You should change this!**
* **To make a user trusted by default**, set `isTrusted: true`.

```javascript
{
    username: 'new_user',
    password: 'secure_password',
    isAdmin: false, // Set to true for admin privileges
    isTrusted: false, // Set to true to enable chat for them
    tags: [], // Admin can add tags like 'TOP SUPPORTER' later
    favorites: [] // Leave empty initially
}
```

### 3. Updating Social Links

To update your social media links, open the `index.html` file. Find the section with `id="socials"` and change the `href="#"` attribute in the `<a>` tags to your profile URLs.

```html
<section id="socials" class="socials-section">
    <h2>Connect With Me</h2>
    <div class="social-links">
        <a href="[https://github.com/your-username](https://github.com/your-username)" target="_blank"><i class="fab fa-github"></i> GitHub</a>
        <a href="[https://linkedin.com/in/your-profile](https://linkedin.com/in/your-profile)" target="_blank"><i class="fab fa-linkedin"></i> LinkedIn</a>
        </div>
</section>
```

## How to Use the Website

1.  Save all three files (`index.html`, `style.css`, `script.js`) in the same folder.
2.  Open `index.html` in your web browser.
3.  The website is now live locally. You can log in using the credentials you defined in `script.js`.

**Disclaimer**: This is a front-end-only template. For a real-world application with multiple users, a secure backend and database are necessary to handle authentication and data storage safely.
