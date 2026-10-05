# PROJECT MAP

## 1. Project Overview

### Purpose

Build a personal portfolio website that allows visitors to quickly understand who the owner is, what they build, and which projects best represent their work.

The portfolio is primarily designed for **recruiters and hiring managers**, while also serving **technical visitors, potential clients/collaborators, and project supporters/funders**.

The site should make it easy to:

1. Understand the person and their work.
2. Discover the most relevant projects.
3. Explore projects in more depth.
4. Find GitHub and LinkedIn.
5. Support selected projects financially when funding is enabled.

### Primary experience

The default experience should be **Minimal & Professional**:

- Clean
- Comfortable to look at
- Easy to scan
- Recruiter-friendly
- Generous whitespace
- Subtle animation
- Strong but restrained visual hierarchy

The portfolio should also provide an **Experimental Mode** that is substantially more expressive and immersive, potentially involving strong animation, unconventional layouts, video, or an Apple-like polished experience.

The exact implementation and storytelling approach of Experimental Mode is intentionally not fixed yet.

---

## 2. Target Users

### Primary

**Recruiters / Hiring Managers**

Need to quickly determine:

- Who the owner is.
- What they build.
- What technologies they use.
- Which projects demonstrate capability.
- What achievements/background they have.
- Where to find GitHub and LinkedIn.

### Secondary

**Developers / Technical Professionals**

Interested in:

- Technical details.
- Technologies used.
- Architecture/implementation.
- Source code.
- Live demonstrations.

**Potential Clients / Collaborators**

Interested in:

- What has been built.
- Practical usefulness.
- Results.
- Ability to execute real-world projects.

**Project Supporters / Funders**

Interested in:

- Projects currently seeking funding.
- Why funding is needed.
- Funding progress.
- Supporting a specific project.

**Students / Learners**

May explore projects for educational or technical inspiration.

---

## 3. Core User Journey

### Standard journey

Visitor arrives at homepage.

→ Understands who the owner is and what they build.

→ Optionally interacts with first-visit personalization poll.

→ Sees strongest/relevant projects.

→ Opens a project.

→ Views concise overview first.

→ Can explore deeper technical information.

→ Uses GitHub and/or live demo when available.

→ Can return to all projects.

→ Uses combined filters to discover projects.

→ Can visit LinkedIn/GitHub to connect.

### Personalized journey

First-time visitor arrives.

→ Poll opens automatically.

→ Visitor may skip.

**If skipped:**

→ Default strongest-project ranking is shown.

**If completed:**

→ Visitor identifies their primary visitor type.

→ Visitor selects multiple interests.

→ System matches answers against project metadata.

→ Relevant projects are displayed.

→ Visitor can load more / browse all projects.

### Funding journey

Visitor opens a funded project.

→ Sees project-specific donation/funding page.

→ Sees funding goal.

→ Sees amount raised.

→ Sees progress bar.

→ Sees explanation of what funding supports.

→ Chooses UPI/payment gateway.

→ Payment is processed externally.

→ Only a verified successful payment updates the amount raised.

→ Once the goal is reached, further donations automatically stop.

---

## 4. Features

### 4.1 Homepage

Homepage contains:

- Introduction / bio
- Small education section
- Skills / technologies
- Strongest projects
- Achievements
- GitHub
- LinkedIn

No empty Work Experience section is required because there is currently no work experience to present.

### 4.2 Strongest Projects

The homepage presents a curated set of strongest projects.

Ranking is based on a combination of:

- Real-world usefulness / impact
- GitHub activity such as stars/forks
- Owner's own judgment

There is intentionally **no rigid mathematical scoring formula** at this stage.

The owner retains final editorial control.

### 4.3 Project Cards

A project card contains:

- Project name
- One-line description
- Project image
- Technology tags
- GitHub metrics when the configured display threshold is reached
- View Project button

Empty or irrelevant action buttons should not appear.

### 4.4 Project Detail Pages

Every project has a detail page containing:

- Concise overview
- Problem
- What was built
- Result / outcome
- Strong visuals, screenshots, or demo material
- Technical details for visitors who want deeper information
- Available external links

Links are conditional:

- Live Demo / Try It if available
- GitHub if available
- Both when both exist
- Neither when neither exists

The page should not become a long academic-style case study.

### 4.5 First-Visit Personalization Poll

The poll appears automatically for first-time visitors.

The visitor may skip it.

The poll asks:

**What brings you here?**

Visitor selects exactly one primary type:

- Recruiter / Hiring Manager
- Developer / Technical Professional
- Potential Client / Collaborator
- Project Supporter / Funder
- Student / Learner
- Other

The poll also asks what the visitor is interested in.

Interests are **multi-select**, with no ranking.

Example interests:

- AI / Machine Learning
- Software / Web Applications
- Developer Tools
- Real-world Applications
- Open Source
- Other

### 4.6 Personalized Project Matching

Projects contain tags describing their characteristics.

Relevant tags can represent:

- Interest/domain
- Technology
- Project type

The system uses:

**visitor type + selected interests + project tags**

to determine which projects to show as personalized recommendations.

The system does not replace the standard portfolio browsing experience.

After personalized projects are shown, visitors can:

- Load more
- View all projects
- Use normal project filters

### 4.7 All Projects Browser

All projects are available through a normal browsing experience.

Filtering supports:

- Interest / domain
- Technology
- Project type

Filters can be combined.

Example:

`AI + Python + Web Application`

### 4.8 Project Tag Suggestions

When adding a project through the private admin area:

1. Owner enters project information.
2. System suggests relevant metadata/tags.
3. Owner reviews suggestions.
4. Owner can edit, approve, or remove suggestions.
5. Project is published only after owner approval.

Automatic tagging is therefore **assistive**, not authoritative.

### 4.9 Funding / Donations

Only projects with an active funding goal display a donation option.

Each funded project has a dedicated funding page.

The funding page displays:

- Funding goal
- Amount raised
- Progress bar
- Short explanation of what the funding will be used for
- UPI and/or payment gateway option

Successful payment processing updates the project's amount raised automatically.

Failed, abandoned, or cancelled payments must not increase the total.

When:

`amount raised >= funding goal`

the system:

- Stops accepting additional donations.
- Displays **Goal reached**.

### 4.10 Private Admin Area

A private admin area is provided for managing:

- Projects
- Project metadata
- Funding information

The admin workflow must support the tag review process before a project becomes public.

---

## 5. Screens / Interfaces

### Public

#### Homepage

Main portfolio landing page.

Expected content order:

1. Introduction
2. Education / relevant background
3. Skills / technologies
4. Strongest projects
5. Achievements
6. GitHub + LinkedIn

#### Project Detail Page

Contains project overview, problem, solution/build, result, visuals, technical detail, and available links.

#### All Projects Page

Contains all public projects and combined filters.

#### Funding Page

Exists only for projects with active funding goals.

Contains funding progress and payment options.

#### Experimental Mode

Alternative presentation of the portfolio.

The exact interface is intentionally unresolved.

### Private

#### Admin Area

Used to manage projects and funding-related information.

---

## 6. Data Model

The exact database technology is not prescribed.

Conceptually, the system needs at least the following entities.

### Project

Fields conceptually include:

- ID
- Name
- Short description
- Problem
- What was built
- Result
- Long/technical description
- Images/screenshots
- Demo URL
- GitHub URL
- Technologies
- Interest/domain tags
- Project type tags
- GitHub metrics
- Featured status/ranking
- Public/private status
- Funding enabled
- Funding goal
- Amount raised

### Visitor Preference

For personalization:

- Visitor/session identifier
- Primary visitor type
- Selected interests
- Whether poll was completed or skipped

Persistent identity is not required solely for this feature unless later decided.

### Donation / Payment Record

Conceptually:

- Donation/payment ID
- Project ID
- Amount
- Payment status
- Payment provider/reference
- Timestamp
- Verification status

Only verified successful transactions contribute to project funding totals.

### Site Content

The portfolio also contains content such as:

- Bio
- Education
- Skills
- Achievements
- GitHub URL
- LinkedIn URL

How these values are stored and edited is not fully defined and does not need to be overengineered for V1.

---

## 7. Business / Application Rules

1. The default portfolio experience is Minimal & Professional.

2. Experimental Mode is available as an alternative experience.

3. Education is visible but intentionally a **small supporting section**, not a dominant homepage element.

4. The homepage focuses primarily on projects and what the owner builds.

5. Strongest-project ranking combines:
   - real-world usefulness/impact
   - GitHub activity
   - owner judgment

6. GitHub stars/forks are shown on cards only when the configured display threshold is reached.

7. First-time visitors automatically receive the personalization poll.

8. Visitors may skip the poll.

9. Skipping the poll results in the standard strongest-project ranking.

10. Visitor type is single-select.

11. Interests are multi-select and are not ranked.

12. Project matching uses visitor preferences and project metadata.

13. Visitors can still access all projects after personalization.

14. Project filters support combinations of:

- domain/interest
- technology
- project type

15. Automatically suggested project tags require owner review before publication.

16. A project displays Donate only when it has an active funding goal.

17. Donation progress is project-specific.

18. Only successfully verified payments increase the amount raised.

19. Funding stops automatically when the goal is reached.

20. Projects must not display unavailable links or irrelevant buttons.

21. The site should avoid unnecessary complexity that does not improve the portfolio experience.

---

## 8. External Services

Potential external dependencies include:

### GitHub

Used for:

- Repository links
- GitHub activity/metrics
- Potential project information

Exact API usage is not yet fixed.

### LinkedIn

Used as an external connection/profile destination.

### Payment Provider / UPI

Required for project donations.

The exact provider is not selected yet.

The integration must support reliable confirmation of successful payments before funding totals are updated.

---

## 9. Non-Functional Requirements

### Visual

The site should be:

- Clean
- Comfortable to view
- Highly readable
- Easy to scan
- Responsive
- Professionally presented

Animation should support the experience rather than make the normal portfolio difficult to navigate.

### Performance

The core portfolio experience should load and respond quickly enough for a recruiter or first-time visitor to browse without friction.

### Usability

A visitor should be able to understand the purpose of the site without needing to explore deeply.

Important information should not be hidden behind unnecessary interactions.

### Maintainability

Project information should be easy to update.

Tag suggestions should reduce manual classification effort without removing human review.

### Security

The admin area must not be publicly accessible without authorization.

Payment verification must be handled securely.

Private administrative information must not leak into public pages.

---

## 10. Constraints

### Known

- No work-experience section is needed currently.
- The site should remain simple rather than becoming an unnecessarily complex platform.
- Personalized discovery is optional for visitors.
- Project funding is optional and project-specific.
- Experimental Mode should coexist with the professional default experience.

### To preserve flexibility

The following should be configuration/data-driven where practical:

- Featured project selection
- GitHub metric threshold
- Project tags
- Funding goals
- Enabled/disabled donation state

---

## 11. Decisions Made

| Decision                    | Result                                                                |
| --------------------------- | --------------------------------------------------------------------- |
| Primary audience            | Recruiters / hiring managers                                          |
| Secondary audiences         | Technical people, clients/collaborators, supporters/funders, learners |
| Default visual style        | Minimal & Professional                                                |
| Alternative style           | Experimental Mode                                                     |
| Education prominence        | Small supporting section                                              |
| Homepage focus              | Identity + what is built + strongest projects                         |
| Project page style          | Concise overview + deeper technical information                       |
| Project ranking             | Impact/usefulness + GitHub activity + owner judgment                  |
| Project card                | Name + description + image + tags + conditional metrics + button      |
| First-visit personalization | Automatic but skippable                                               |
| Visitor type                | Single selection                                                      |
| Interests                   | Multiple selection, no ranking                                        |
| Personalized matching       | Visitor preferences + project tags                                    |
| All-project browsing        | Supported                                                             |
| Project filtering           | Domain + technology + project type, combinable                        |
| Tag generation              | System suggestions                                                    |
| Tag publishing              | Owner reviews/edits/approves/removes                                  |
| Donations                   | Only for funded projects                                              |
| Funding page                | Dedicated per project                                                 |
| Donation progress           | Automatically updated after verified successful payment               |
| Funding completion          | Donations automatically stop at goal                                  |
| Public contact              | GitHub + LinkedIn                                                     |
| Admin                       | Private project + funding management                                  |

---

## 12. Assumptions

The following are implementation assumptions rather than final product decisions:

1. The site will have a persistent mechanism for knowing whether a visitor is a first-time visitor, such as local browser/session state.

2. The personalized poll does not need a visitor account.

3. Project recommendation does not require sophisticated machine learning; a deterministic tag/relevance system is sufficient for V1.

4. GitHub metrics may be fetched periodically rather than on every page request.

5. The owner's general portfolio content can initially be maintained without requiring every field to be editable through the admin panel.

6. The specific design of Experimental Mode can evolve after the core portfolio is working.

7. The payment provider will supply sufficient payment-status information to verify successful transactions.

---

## 13. Out of Scope

The following are not required for the initial version unless later added:

- User accounts for ordinary visitors
- Visitor profiles
- Messaging/chat between visitors and owner
- A contact form
- Complex recommendation AI
- A rigid numerical scoring algorithm for project ranking
- Detailed project analytics dashboard
- Full content-management system for every portfolio field
- Social network functionality
- Complex fundraising campaigns with deadlines and milestones
- Detailed public financial-spending reports
- Advanced donor management unless payment requirements later demand it

---

## 14. Acceptance Criteria

### Homepage

**USER NEED:** Visitor needs to quickly understand who the owner is and what they build.

**USER ACTION:** Open homepage.

**SYSTEM BEHAVIOR:** Homepage immediately presents introduction and then supporting background and strongest projects.

**EXPECTED RESULT:** Visitor understands the portfolio's purpose without searching.

**ACCEPTANCE CRITERION:** A first-time visitor can identify the person, their type of work, and their strongest work from the homepage without opening another page.

---

### Project Discovery

**USER NEED:** Visitor wants projects relevant to their interests.

**USER ACTION:** Complete the first-visit poll.

**SYSTEM BEHAVIOR:** System uses visitor type and selected interests against project tags.

**EXPECTED RESULT:** Relevant projects are prioritized.

**ACCEPTANCE CRITERION:** A completed poll changes project recommendations relative to the default ranking.

---

### Poll Skip

**USER NEED:** Visitor does not want to answer questions.

**USER ACTION:** Skip the poll.

**SYSTEM BEHAVIOR:** System proceeds without personalization.

**EXPECTED RESULT:** Normal strongest-project ranking is shown.

**ACCEPTANCE CRITERION:** Skipping the poll never prevents access to the portfolio or projects.

---

### Project Browsing

**USER NEED:** Visitor wants to find a specific type of project.

**USER ACTION:** Apply one or more filters.

**SYSTEM BEHAVIOR:** Projects are filtered using domain/interest, technology, and project type.

**EXPECTED RESULT:** Only matching projects remain visible.

**ACCEPTANCE CRITERION:** Multiple filters can be combined and produce the intersection of selected criteria.

---

### Project Metadata

**USER NEED:** Owner wants project classification without fully manual tagging.

**USER ACTION:** Add a project.

**SYSTEM BEHAVIOR:** System suggests metadata/tags.

**EXPECTED RESULT:** Owner sees useful suggestions before publication.

**ACCEPTANCE CRITERION:** No automatically suggested tag becomes public without owner review/approval.

---

### Project Links

**USER NEED:** Visitor wants to try or inspect a project.

**USER ACTION:** Open project page.

**SYSTEM BEHAVIOR:** System displays only links that actually exist.

**EXPECTED RESULT:** Visitor sees relevant Live Demo and/or GitHub actions.

**ACCEPTANCE CRITERION:** Missing links never produce empty or misleading buttons.

---

### Funding

**USER NEED:** Visitor wants to support a project.

**USER ACTION:** Open the donation page and make a payment.

**SYSTEM BEHAVIOR:** Payment is sent through the configured payment provider and verified before the project total is updated.

**EXPECTED RESULT:** Successful donations increase the project's funding progress.

**ACCEPTANCE CRITERION:** Failed, cancelled, or abandoned payments do not increase the amount raised.

---

### Funding Goal

**USER NEED:** Owner wants donations to stop once sufficient funding has been reached.

**USER ACTION:** Funding total reaches the project goal.

**SYSTEM BEHAVIOR:** System automatically disables further donations.

**EXPECTED RESULT:** Project displays "Goal reached."

**ACCEPTANCE CRITERION:** No additional donation transaction can be initiated after the funding goal is reached.

---

### Admin Security

**USER NEED:** Owner needs to manage private portfolio information.

**USER ACTION:** Attempt to access admin area.

**SYSTEM BEHAVIOR:** System requires authorization.

**EXPECTED RESULT:** Unauthorized visitors cannot access administrative functions.

**ACCEPTANCE CRITERION:** Public visitors cannot create, edit, publish, or alter projects or funding information.

---

## 15. Open Questions

These do **not** block creation of the initial product map, but should be resolved during implementation/design:

1. What exact presentation/storytelling will Experimental Mode use?
2. What GitHub-star/fork threshold should trigger metrics on a project card?
3. Which payment provider(s) will be used for donations?
4. What exact authentication method should protect the admin area?
5. How should project recommendation relevance be weighted when multiple tags match?
6. Should GitHub metrics update automatically on a schedule or be refreshed manually?
7. How much technical detail should appear immediately versus behind expandable sections on project pages?

---

# IMPLEMENTATION STATUS: NOT STARTED
