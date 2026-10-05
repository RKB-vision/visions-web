# ARCHITECTURE MAP

## 1. Architectural Summary

### 1.1 Architectural goal

The portfolio should be built as a **single, cohesive web application with clearly separated responsibilities**, rather than as multiple independent services.

The architecture must support two experiences:

- **Minimal & Professional** as the default public experience.
- **Experimental Mode** as an alternative presentation that can evolve without forcing the core portfolio logic to change.

The core system consists of:

```text
                         PUBLIC VISITOR
                               |
                               v
                    +----------------------+
                    |   PUBLIC INTERFACE   |
                    | Homepage / Projects  |
                    | Project / Funding    |
                    +----------+-----------+
                               |
                               v
                    +----------------------+
                    |   APPLICATION LAYER  |
                    |                      |
                    | Content              |
                    | Project Discovery    |
                    | Personalization      |
                    | Project Management   |
                    | Funding              |
                    | External Integrations|
                    +----+------------+----+
                         |            |
                         v            v
                +---------------+  +------------------+
                |  PERSISTENCE  |  | EXTERNAL SERVICES |
                | Projects      |  | GitHub            |
                | Tags          |  | Payment / UPI     |
                | Funding       |  | LinkedIn (link)   |
                | Payments      |  +------------------+
                | Site content  |
                +---------------+

                         ^
                         |
                 +-------+-------+
                 |  PRIVATE ADMIN |
                 | Authorization  |
                 | Project/Funding|
                 | Tag review      |
                 +----------------+
```

### 1.2 Recommended architectural shape

**Recommended:** a **modular monolith**: one deployable application, internally divided into logical components.

This is appropriate because the Project Map requires a relatively small portfolio application, not a distributed platform. The project needs clear boundaries, but there is no requirement that justifies microservices, message queues, distributed caching, or other infrastructure complexity.

This recommendation is an architectural simplification, not a requirement from the Project Map. A future implementation agent may choose a concrete framework or hosting model later, provided it preserves the boundaries described here.

### 1.3 Core architectural principles

- Public presentation and business rules are separate.
- Portfolio content is data-driven wherever the Project Map explicitly requires maintainability.
- Visitor personalization is temporary visitor state, not a user-account system.
- Recommendation logic is deterministic and explainable for V1; it is not an AI recommendation platform.
- AI-generated metadata suggestions are **proposals**, never authoritative project metadata.
- External services remain outside the application's trust boundary.
- Payment provider confirmation is authoritative for payment success; a client-side success screen is not sufficient evidence.
- Private admin operations are protected at the application boundary, not merely hidden in the UI.
- Experimental Mode changes presentation, not core project/funding truth.

### 1.4 Requirement-to-architecture chain

The intended architectural reasoning is:

```text
Requirement
   |
   v
Owning Component
   |
   v
Required Data / External Service
   |
   v
Application Rule / Security Boundary
   |
   v
Verification Evidence
```

Every significant requirement is assigned to an architectural home in Section 16.

---

## 2. System Boundaries

### 2.1 Public interface boundary

This is the portion accessible to ordinary visitors without administrative authorization.

It includes:

- Homepage
- First-visit personalization poll
- Personalized project recommendations
- All Projects browser
- Project detail pages
- Funding pages for funded projects
- Experimental Mode presentation
- GitHub and LinkedIn outbound links

Public pages may read **published/public portfolio data**, but must not expose private administrative data.

### 2.2 Private administration boundary

The Admin Area is a protected interface for the owner.

It is responsible for:

- Creating and editing projects
- Reviewing/editing/approving/removing generated tags
- Publishing projects
- Managing project metadata
- Managing funding information

The admin boundary is an authorization boundary. A visitor must not be able to invoke administrative actions merely by reaching a hidden URL or manipulating public requests.

### 2.3 Application/business-logic boundary

This layer owns the rules that should not be trusted to the browser or external services.

Examples:

- Determining the effective project list/ranking
- Applying project filters
- Matching visitor preferences to tags
- Enforcing publication rules
- Enforcing conditional link visibility
- Determining whether funding is still accepting donations
- Accepting a payment result only after provider verification
- Updating verified funding totals

### 2.4 Persistence boundary

Persistence stores the portfolio's durable application state.

Conceptually this includes:

- Public/private project data
- Project metadata/tags
- Featured/ranking configuration
- Funding configuration
- Verified payment records
- Site content where persistent storage is chosen

The exact database technology is intentionally **not prescribed by the Project Map**.

### 2.5 Visitor-state boundary

The personalization poll requires a way to distinguish a visitor's first visit from later visits. The Project Map does not require visitor accounts.

Therefore the architecture should use temporary/pseudonymous browser or session state for V1 unless a later product decision changes this.

This state should contain only what is necessary for the experience, such as:

- Poll status: not seen/completed/skipped
- Visitor type
- Selected interests

### 2.6 External-service boundary

External systems include:

- GitHub
- Payment provider / UPI mechanism
- LinkedIn as an external destination

The application should treat external responses as untrusted input and validate them before using them in important business logic.

### 2.7 Out-of-scope boundaries

The architecture should **not** introduce boundaries for:

- Ordinary visitor accounts
- Visitor profiles
- Messaging/chat
- Contact forms
- Complex recommendation AI
- Full CMS functionality for every field
- Social networking
- Complex campaign management
- Advanced donor management

These are explicitly outside V1 unless later requirements add them.

---

## 3. Major Components

### 3.1 Public Portfolio Interface

Purpose: present the owner's identity, capabilities, projects, links, and funding opportunities to visitors.

Primary surfaces:

- Homepage
- Project detail page
- All Projects page
- Funding page
- Experimental Mode
- Personalization poll

### 3.2 Personalization Component

Purpose: manage the first-visit poll and visitor preference state.

It captures:

- Exactly one primary visitor type
- Zero or more selected interests
- Completed/skipped status

It hands those preferences to the Project Discovery component.

### 3.3 Project Discovery Component

Purpose: expose and organize public projects for both normal browsing and personalized discovery.

It handles:

- Default strongest-project presentation
- Personalized recommendations
- Combined filtering
- Load-more/browse-all behavior
- Project ordering as an application behavior

The V1 recommendation method should be deterministic and tag-based rather than sophisticated machine learning.

### 3.4 Project Content / Portfolio Data Component

Purpose: own the authoritative portfolio information used by public pages.

It covers conceptual information such as:

- Project identity and descriptions
- Problem / build / result
- Technical details
- Images/screenshots
- Technology tags
- Interest/domain tags
- Project type tags
- External links
- Publication state
- Featured/ranking information

### 3.5 Project Management / Admin Component

Purpose: provide the owner with controlled management of projects and metadata.

Responsibilities:

- Create draft project information
- Request tag suggestions
- Present suggestions for owner review
- Accept owner edits/removals/approvals
- Publish only after required review
- Edit already-managed project information

### 3.6 Metadata Assistant Component

Purpose: reduce manual classification effort by suggesting project metadata/tags during project creation.

This component is explicitly **assistive**.

It may propose tags, but it must not publish them as authoritative metadata without owner approval.

### 3.7 Funding Component

Purpose: manage project-specific funding configuration and funding state.

Responsibilities:

- Determine whether a project is funding-enabled
- Display goal and amount raised
- Calculate/display funding progress
- Explain funding purpose
- Decide whether donations may currently be initiated
- Stop new donations at the funding goal
- Record only verified successful payments as funding progress

### 3.8 Payment Integration Component

Purpose: communicate with the selected payment provider / UPI mechanism and verify payment outcomes.

The concrete provider is not yet chosen.

This component isolates provider-specific behavior from the rest of the funding logic.

### 3.9 GitHub Integration Component

Purpose: connect projects to GitHub and obtain configured GitHub metrics where required.

Responsibilities may include:

- Repository linking
- Retrieving stars/forks/activity data where configured
- Supplying data used for project-card metric display
- Supporting periodic refresh if that approach is selected

The exact API and update mechanism remain open.

### 3.10 Authentication / Authorization Component

Purpose: protect the private admin boundary.

It determines whether a request is authorized to perform administrative operations.

The exact authentication method remains open.

### 3.11 Site Content Component

Purpose: expose the small set of portfolio-wide content not represented as projects.

Conceptual content includes:

- Bio
- Education
- Skills
- Achievements
- GitHub URL
- LinkedIn URL

The Project Map intentionally does not require a full content-management system for these fields in V1.

---

## 4. Component Responsibilities

### 4.1 Public Portfolio Interface

```text
Component: Public Portfolio Interface
Purpose: Present the portfolio to public visitors.
Responsibilities:
- Render the homepage in the Minimal & Professional default mode.
- Render project discovery and project detail experiences.
- Render the first-visit personalization poll.
- Render Experimental Mode when selected/available.
- Show only links/actions supported by actual project data.
- Present funding information only for projects with active funding goals.

Inputs:
- Public site content
- Public project data
- Visitor preference state
- Project discovery results
- Funding state

Outputs:
- Pages and interaction results presented to the visitor.
- Visitor actions routed to application logic.

Depends on:
- Project Content
- Project Discovery
- Personalization
- Funding
- Authentication only for protected interface entry

Used by:
- Recruiters/hiring managers
- Technical visitors
- Clients/collaborators
- Supporters/funders
- Students/learners

Data owned:
- No independent authoritative portfolio data; it presents data owned by other components.

Important failure cases:
- Missing project assets or links
- Empty filter result
- External metric unavailable
- Funding status unavailable
- Experimental Mode content incomplete
```

### 4.2 Personalization

```text
Component: Personalization
Purpose: Determine whether a visitor wants personalized discovery and store the minimum temporary preference state needed for it.
Responsibilities:
- Detect first visit using the chosen visitor-state mechanism.
- Present poll automatically on first visit.
- Enforce exactly one visitor type selection.
- Allow multiple interests.
- Allow skip.
- Record completed vs skipped status.
- Provide preferences to Project Discovery.

Inputs:
- Visitor interaction
- Existing browser/session state

Outputs:
- Visitor preference state
- Personalized discovery request

Depends on:
- Visitor-state mechanism
- Project Discovery

Used by:
- Public Portfolio Interface
- Project Discovery

Data owned:
- Temporary visitor preference state.

Important failure cases:
- Corrupted/expired preference state
- Duplicate or invalid interest values
- Visitor returns after storage is cleared

Security considerations:
- No privileged trust should be assigned to visitor preferences.
```

### 4.3 Project Discovery

```text
Component: Project Discovery
Purpose: Provide normal and personalized project discovery.
Responsibilities:
- Provide the curated strongest-project set.
- Use owner-controlled ranking/featured information.
- Apply configured GitHub/activity information as one ranking input where appropriate.
- Match visitor type + interests + project tags for personalization.
- Support combined domain/interest + technology + project-type filters.
- Support load-more and browse-all behavior.

Inputs:
- Published projects
- Project metadata/tags
- Owner-controlled featured/ranking state
- Visitor type
- Selected interests
- Filter selections
- Available GitHub metrics

Outputs:
- Ordered public project list
- Filtered project list
- Personalized project list

Depends on:
- Project Content
- Personalization
- GitHub Integration where current metrics are used for ranking/display

Used by:
- Homepage
- All Projects page
- Personalization flow

Data owned:
- Recommendation/ranking behavior, not the underlying project truth.

Important failure cases:
- No matching projects
- Missing/inconsistent tags
- Missing GitHub metrics
- Invalid filter values

Design constraint:
- Do not require a rigid numerical scoring formula unless a later product decision explicitly introduces one.
```

### 4.4 Project Content / Portfolio Data

```text
Component: Project Content / Portfolio Data
Purpose: Store and expose authoritative portfolio/project information.
Responsibilities:
- Store project content and metadata.
- Distinguish public vs private project state.
- Store external links when they exist.
- Store owner-approved tags.
- Store featured/ranking configuration.
- Expose published projects to public components.

Inputs:
- Owner-entered project information
- Approved metadata
- GitHub-derived metrics when persisted
- Funding configuration

Outputs:
- Authoritative project records to application components

Depends on:
- Persistence

Used by:
- Public Portfolio Interface
- Project Discovery
- Admin
- Metadata Assistant
- Funding

Data owned:
- Project records and approved metadata.

Important failure cases:
- Draft published accidentally
- Missing required content
- Inconsistent tag state
- Private data exposed to public consumers
```

### 4.5 Project Management / Admin

```text
Component: Project Management / Admin
Purpose: Give the owner a protected workflow for maintaining projects and funding settings.
Responsibilities:
- Create/edit project records.
- Keep newly created projects non-public until review requirements are satisfied.
- Request/display metadata suggestions.
- Apply owner decisions to suggestions.
- Publish/unpublish projects.
- Manage funding settings.

Inputs:
- Authorized owner actions
- Project data
- Suggested metadata
- Funding configuration

Outputs:
- Updated authoritative project/funding data
- Published/unpublished state changes

Depends on:
- Authentication / Authorization
- Project Content
- Metadata Assistant
- Funding

Used by:
- Owner only

Data owned:
- Administrative state changes entered by the owner.

Important failure cases:
- Unauthorized request
- Partial update
- Publishing before tag review
- Invalid funding configuration
```

### 4.6 Metadata Assistant

```text
Component: Metadata Assistant
Purpose: Suggest useful project tags/metadata while preserving human approval.
Responsibilities:
- Receive project information.
- Produce candidate tags/metadata.
- Present suggestions to the owner for review.
- Keep suggestion status separate from approved metadata.

Inputs:
- Draft project information

Outputs:
- Suggested metadata/tags

Depends on:
- Draft project data
- Any future suggestion provider selected by implementation

Used by:
- Project Management / Admin

Data owned:
- Suggestions only, unless/ until approved by the owner.

Important failure cases:
- Poor suggestions
- Duplicate tags
- Unsupported tags
- Suggestion service failure

Critical rule:
- A suggestion cannot become public project metadata without owner approval.
```

### 4.7 Funding

```text
Component: Funding
Purpose: Enforce project-specific funding rules and expose funding state.
Responsibilities:
- Determine whether funding is enabled.
- Store/interpret funding goal.
- Read authoritative verified funding total.
- Calculate progress for presentation.
- Allow donation initiation only while goal remains unreached.
- Automatically transition to goal-reached behavior when amount raised >= goal.
- Prevent new donation initiation after the goal is reached.

Inputs:
- Project funding configuration
- Verified payment records
- Visitor donation request

Outputs:
- Funding page state
- Donation eligibility decision
- Updated funding state after verified payment processing

Depends on:
- Project Content / Funding configuration
- Payment Integration
- Persistence

Used by:
- Public Funding Page
- Admin

Data owned:
- Funding configuration and application-level funding state.
- Verified payment records are persisted through the payment boundary but are authoritative only after verification.

Important failure cases:
- Provider unavailable
- Payment status ambiguous
- Duplicate payment notification
- Concurrent payments approaching/exceeding the goal
- Invalid/missing funding configuration

Critical rule:
- Client-side claims of success must never directly increase funding totals.
```

### 4.8 Payment Integration

```text
Component: Payment Integration
Purpose: Integrate the chosen external payment provider / UPI mechanism with the funding system.
Responsibilities:
- Create/initialize payment attempts using the provider's supported mechanism.
- Receive/check provider payment status.
- Verify successful transactions.
- Return normalized payment outcome to Funding.
- Preserve provider references for reconciliation.

Inputs:
- Project identifier
- Donation amount
- Provider-required payment information
- Provider callbacks/status information

Outputs:
- Normalized payment status
- Provider reference
- Verification result

Depends on:
- Selected payment provider
- Secure server-side configuration

Used by:
- Funding

Data owned:
- Provider-specific integration state and normalized verification result.

Important failure cases:
- Payment failure
- Cancellation/abandonment
- Provider timeout
- Callback replay
- Invalid signature/status
- Provider reports success but local verification fails

Critical rule:
- Only verified successful payment records can contribute to funding totals.
```

### 4.9 GitHub Integration

```text
Component: GitHub Integration
Purpose: Obtain and normalize project-related GitHub information.
Responsibilities:
- Associate project records with GitHub repositories.
- Retrieve configured repository metrics.
- Supply stars/forks/activity information where needed.
- Support a future scheduled or manual refresh strategy.

Inputs:
- Repository identifiers/URLs

Outputs:
- Normalized GitHub metrics
- Repository link information

Depends on:
- GitHub

Used by:
- Project Discovery
- Public Portfolio Interface
- Project Content persistence, if metrics are stored

Data owned:
- None of the authoritative repository truth; GitHub remains authoritative for GitHub metrics.

Important failure cases:
- Rate limiting
- Repository unavailable
- API failure
- Missing metrics
- Stale metrics

Design rule:
- A GitHub-derived metric should be clearly treated as external/derived data, not owner-authored project truth.
```

### 4.10 Authentication / Authorization

```text
Component: Authentication / Authorization
Purpose: Protect the private administrative boundary.
Responsibilities:
- Authenticate the owner using the selected mechanism.
- Establish whether the current request is authorized.
- Gate admin reads/writes.
- Prevent anonymous public requests from performing administrative actions.

Inputs:
- Login/authentication request
- Request/session credentials

Outputs:
- Authenticated/unauthenticated result
- Authorized/unauthorized result

Depends on:
- Chosen authentication mechanism

Used by:
- Admin Area
- Any protected administrative backend operation

Data owned:
- Authentication/session state as required by the chosen mechanism.

Important failure cases:
- Invalid credentials
- Expired session
- Unauthorized operation
- Session tampering

Security rule:
- Authorization must be enforced server-side/application-side, not solely by hiding admin UI controls.
```

### 4.11 Site Content

```text
Component: Site Content
Purpose: Provide portfolio-wide content such as bio and education.
Responsibilities:
- Store or expose bio, education, skills, achievements, and social links.
- Keep the representation easy to maintain.
- Avoid requiring a full CMS for V1.

Inputs:
- Owner-maintained content

Outputs:
- Public site content

Depends on:
- Persistence or a simple configuration/content mechanism

Used by:
- Homepage
- Footer/social-link areas as appropriate

Data owned:
- Portfolio-wide site content.

Important failure cases:
- Missing required content
- Broken outbound URLs
```

---

## 5. Component Dependency Map

```text
                                PUBLIC VISITOR
                                      |
                                      v
                         +---------------------------+
                         |  PUBLIC PORTFOLIO UI      |
                         | Home / Projects / Detail  |
                         | Funding / Experimental    |
                         +-----+-----------+---------+
                               |           |
                    +----------+           +-------------------+
                    |                                          |
                    v                                          v
             +-------------+                           +---------------+
             |PERSONALIZ.  |                           |    FUNDING    |
             |poll + state |                           |goal + progress|
             +------+------+                           +-------+-------+
                    |                                            |
                    v                                            v
             +-------------+                           +---------------+
             |   PROJECT   |<--------------------------|    PAYMENT    |
             |  DISCOVERY  |                           |  INTEGRATION  |
             |match/filter |                           +-------+-------+
             +------+------+                                   |
                    |                                          v
                    v                                   PAYMENT PROVIDER
             +-------------+
             |   PROJECT   |<----------------------------- GITHUB
             | CONTENT/DATA|<------------------------+       |
             +------+------+                         |       |
                    ^                                |       |
                    |                                |       |
             +------+------+                  +------+-------+
             |    ADMIN    |----------------->|   METADATA   |
             | project +   |                  |  ASSISTANT   |
             | funding mgmt|                  +--------------+
             +------+------+
                    ^
                    |
             +------+-------+
             |AUTHENTICATION|
             | / AUTHZ      |
             +--------------+
                    |
                    v
             PRIVATE ADMIN BOUNDARY

                  PERSISTENCE
          +---------------------------+
          | Projects / Tags           |
          | Funding configuration     |
          | Verified payment records  |
          | Site content               |
          | Optional persisted GH data |
          +---------------------------+
```

### Dependency rules

1. The public interface may consume public application results but does not own business truth.
2. Project Discovery depends on approved/public project metadata, not raw AI suggestions.
3. Metadata Assistant feeds suggestions into Admin; it does not publish directly.
4. Funding depends on verified payment outcomes, not browser-reported payment success.
5. Authentication/authorization protects administrative application operations.
6. GitHub remains external; the portfolio may cache/store its metrics but must not reinterpret them as owner-authored truth.
7. Experimental Mode should consume the same underlying portfolio/project/funding services rather than creating a separate data model.

---

## 6. User Flow / Data Flow

### 6.1 Visitor opens homepage

```text
VISITOR
  |
  v
Homepage request
  |
  v
Public Portfolio Interface
  |
  +--> Site Content
  |
  +--> Project Discovery --> published/approved projects
  |
  +--> optional Personalization state check
  |
  v
Rendered homepage
```

Expected result: the visitor can identify the owner, understand what they build, and see the strongest projects without needing to explore another page.

### 6.2 First-visit personalization

```text
FIRST-TIME VISITOR
       |
       v
Public Interface detects first-visit state
       |
       v
Personalization Poll
       |
       +------ Skip ------> record skipped --> default ranking
       |
       +------ Complete --> visitor type (1)
                             + interests (0..N)
                                   |
                                   v
                            Personalization State
                                   |
                                   v
                           Project Discovery
                                   |
                                   v
                           Relevant projects
```

Rules:

- Visitor type is exactly one selection.
- Interests are multi-select and unranked.
- Skipping never blocks access to projects.
- Completing the poll changes the recommendation result relative to the default ranking.

### 6.3 Personalized project matching

```text
Visitor Preferences
(visitor type + interests)
           |
           v
Project Discovery
           |
           +--> published project metadata
           |       - interest/domain tags
           |       - technology tags
           |       - project type tags
           |
           v
Deterministic relevance evaluation
           |
           v
Ordered personalized projects
           |
           +--> Load more
           +--> View all projects
           +--> Normal filters
```

The exact weighting of multiple matching tags is an open architectural decision.

### 6.4 Combined project filtering

```text
USER SELECTS FILTERS
        |
        v
All Projects Interface
        |
        v
Project Discovery
        |
        +--> Domain / Interest filter
        +--> Technology filter
        +--> Project type filter
        |
        v
Intersection of selected criteria
        |
        v
Matching published projects
```

Example:

```text
AI + Python + Web Application
```

must behave as a combination of selected criteria rather than three independent result sets that are later merged loosely.

### 6.5 Open a project

```text
VISITOR
  |
  v
Project Card / Project Link
  |
  v
Project Detail Page
  |
  +--> concise overview
  +--> problem
  +--> what was built
  +--> result/outcome
  +--> visuals
  +--> technical details
  +--> available external links
  |
  +--> if funding enabled --> Funding Page
```

The page exposes only links that actually exist.

### 6.6 Add a project through Admin

```text
OWNER
  |
  v
Authenticate
  |
  v
Admin Area
  |
  v
Create/Edit Draft Project
  |
  v
Metadata Assistant
  |
  v
Suggested tags
  |
  v
Owner reviews / edits / approves / removes
  |
  v
Approved metadata stored
  |
  v
Publish project
  |
  v
Project becomes public
```

The architecture must not provide a path by which an unreviewed suggestion becomes public authoritative metadata.

### 6.7 GitHub metric retrieval

```text
Project -> GitHub repository reference
                     |
                     v
              GitHub Integration
                     |
                     v
                  GitHub
                     |
                     v
             stars/forks/etc.
                     |
                     v
          normalized external data
                     |
              +------+------+
              |             |
              v             v
       display threshold   ranking input
```

The exact refresh strategy is unresolved: scheduled retrieval vs manual refresh.

### 6.8 Funding page and donation initiation

```text
VISITOR
  |
  v
Funded Project
  |
  v
Funding Component
  |
  +--> funding enabled?
  +--> goal already reached?
  |
  +--> no  --> no donation action
  |
  +--> yes --> payment initiation
                    |
                    v
             Payment Provider
                    |
                    v
             provider result
                    |
                    v
            Payment Integration
                    |
                    v
          verify successful payment
                    |
              +-----+------+
              |            |
           verified      not verified
              |            |
              v            v
       persist payment   no increase
       as successful
              |
              v
       update authoritative
       funding total
              |
              v
       re-evaluate goal
              |
       +------+------+
       |             |
    below goal    >= goal
       |             |
       v             v
  continue      Goal reached;
  accepting     stop new donation
```

### 6.9 Funding completion

The transition to `Goal reached` must be based on authoritative verified funding totals. The public interface should reflect the resulting funding state rather than independently deciding whether the goal has been reached.

A future implementation should also account for duplicate payment notifications and concurrent verified payments so that the funding record remains consistent.

---

## 7. Data Architecture

The data model remains conceptual. Exact database technology and exact table/document schema are not prescribed by the Project Map.

### 7.1 Project

**Represents:** one portfolio project.

**Important fields:**

- ID
- Name
- Short description
- Problem
- What was built
- Result/outcome
- Long/technical description
- Images/screenshots
- Demo URL, if available
- GitHub URL, if available
- Technology tags
- Interest/domain tags
- Project type tags
- GitHub metrics
- Featured/ranking information
- Public/private status
- Funding enabled
- Funding goal
- Amount raised / derived funding total

**Relationships:**

```text
Project
  |
  +-- has many technology tags
  +-- has many interest/domain tags
  +-- has many project-type tags
  +-- may reference one GitHub repository
  +-- may have funding configuration
  +-- may have many payment records
```

### 7.2 Visitor Preference

**Represents:** temporary personalization state for a visitor/session.

Important fields:

- Visitor/session identifier
- Primary visitor type
- Selected interests
- Poll completed/skipped state

No persistent user account is required by V1.

### 7.3 Donation / Payment Record

**Represents:** a payment attempt/result associated with a specific project.

Important fields:

- Payment/donation ID
- Project ID
- Amount
- Payment status
- Payment provider/reference
- Timestamp
- Verification status

Only verified successful records may contribute to funding totals.

### 7.4 Site Content

**Represents:** portfolio-wide identity/background information.

Conceptual content:

- Bio
- Education
- Skills
- Achievements
- GitHub URL
- LinkedIn URL

This may be stored using a simple persistence/configuration mechanism. A full CMS is not required by the Project Map.

### 7.5 Suggested metadata

Suggestions should conceptually remain separate from approved metadata.

```text
Draft Project
      |
      v
Suggested Tags
      |
      v
Owner Decision
  /     |      \
keep   edit    remove
  |      |        |
  +------v--------+
         |
         v
Approved Project Metadata
```

This separation is important because the suggestion source is not authoritative.

### 7.6 Public/private classification

Public-facing project data should be limited to published/approved information.

Private data may include:

- Draft project records
- Unapproved tag suggestions
- Administrative settings
- Sensitive payment/provider information
- Authentication/session information

The architecture should prevent a public read path from exposing these records.

### 7.7 Derived data

Examples of derived information:

- Personalized project ordering
- Filtered project lists
- Funding progress percentage
- Goal-reached state
- Display/no-display decision for GitHub metrics

Derived values should be recomputable from authoritative inputs where practical.

---

## 8. Authoritative Sources of Truth

| Information                             | Authoritative source                                         | Classification                       | Notes                                                                      |
| --------------------------------------- | ------------------------------------------------------------ | ------------------------------------ | -------------------------------------------------------------------------- |
| Project description/content             | Owner-approved portfolio project data                        | Authoritative                        | Public only after publication rules are satisfied                          |
| Project tags                            | Owner-approved project metadata                              | Authoritative                        | AI/system suggestions are not authoritative                                |
| Project featured/ranking control        | Owner/editorial portfolio data                               | Authoritative                        | No rigid mathematical formula is required                                  |
| GitHub star/fork/activity metrics       | GitHub                                                       | External authoritative               | Portfolio copy/cache is derived and may become stale                       |
| GitHub repository URL                   | Portfolio project record + referenced GitHub repository      | Authoritative link / external target | Must be valid before showing the action                                    |
| Personalized project relevance          | Application logic using approved tags + visitor preferences  | Derived                              | Exact weighting remains open                                               |
| Filtered project list                   | Application logic using approved public metadata             | Derived                              | Combined filters produce intersection                                      |
| Funding goal                            | Owner-managed project funding configuration                  | Authoritative                        | Must be associated with the project                                        |
| Amount raised                           | Verified successful payment records / funding records        | Authoritative application total      | Must not use client-side success claims                                    |
| Payment success                         | Verified payment-provider result                             | External authoritative               | Provider-specific verification method remains open                         |
| Payment failure/cancellation            | Verified provider result                                     | External authoritative               | Must not increase funding total                                            |
| Goal reached                            | Application-derived from authoritative funding total vs goal | Derived state                        | Must disable further donations                                             |
| Bio / education / skills / achievements | Owner-maintained site content                                | Authoritative                        | Full CMS not required                                                      |
| LinkedIn destination                    | Owner-maintained profile URL                                 | Authoritative destination            | LinkedIn is an external destination, not a data source for portfolio truth |

### Truth hierarchy

```text
OWNER-APPROVED PORTFOLIO DATA
        |
        +--> project content
        +--> approved tags
        +--> funding configuration
        +--> site content

EXTERNAL AUTHORITATIVE SOURCES
        |
        +--> GitHub metrics
        +--> verified payment result

DERIVED APPLICATION STATE
        |
        +--> recommendations
        +--> filters
        +--> progress
        +--> goal reached

ASSISTIVE / NON-AUTHORITATIVE
        |
        +--> AI/system tag suggestions
```

Future coding agents must preserve these distinctions.

---

## 9. External Services

### 9.1 GitHub

**Service:** GitHub

**Purpose:** Repository destinations and project activity/metrics.

**Information sent:** Repository identifiers/URLs and API requests required by the chosen integration.

**Information received:** Repository metadata and metrics such as stars/forks/activity where supported and needed.

**Who owns the truth:** GitHub owns the authoritative repository metrics.

**Failure behavior:**

- Do not make the portfolio unusable because GitHub metrics are temporarily unavailable.
- Treat unavailable metrics as unavailable/stale data.
- Do not fabricate missing numbers.
- A cached metric may be displayed only if the implementation clearly treats it as derived/stale external data.

**Security considerations:**

- Protect any required API credentials.
- Do not expose private credentials to public clients.
- Handle rate limits and provider errors gracefully.

**Open point:** exact API usage and refresh strategy are not fixed.

### 9.2 LinkedIn

**Service:** LinkedIn as an outbound profile destination.

**Purpose:** let visitors connect with the owner.

**Information sent:** visitor is sent to the owner's LinkedIn URL.

**Information received:** none required for the portfolio's core operation.

**Who owns the truth:** the destination URL is owner-maintained; LinkedIn remains the external destination.

**Failure behavior:** a broken/outdated URL should be treated as a content-maintenance issue, not as a core application dependency.

**Security considerations:** validate/maintain the configured URL and do not treat LinkedIn as an authentication provider unless the requirements later change.

### 9.3 Payment provider / UPI

**Service:** payment provider / UPI mechanism, provider not selected.

**Purpose:** collect project-specific donations.

**Information sent:** donation amount, project/payment context, and provider-required payment details.

**Information received:** payment status, provider reference, and verification data supported by the provider.

**Who owns the truth:** the payment provider is authoritative for the payment result; the portfolio is authoritative for the resulting local funding record and project total once verified.

**Failure behavior:**

- Failed/cancelled/abandoned payments do not increase amount raised.
- Ambiguous status is treated as unverified until verified.
- Provider downtime should not corrupt local funding totals.
- Replayed provider notifications must not create duplicate funding records.

**Security considerations:**

- Verification must occur through a trusted server-side/application boundary.
- Provider secrets must not be exposed to public clients.
- Payment status must be validated against provider evidence.
- Funding updates should be protected against duplicate processing and inconsistent concurrent updates.

**Open point:** exact provider and integration mechanism are not selected.

---

## 10. Authentication & Security Boundaries

### 10.1 Public operations

Public visitors may:

- Read published portfolio content
- Read published projects
- Apply filters
- Submit personalization preferences
- View funded projects
- Initiate supported donation flows
- Follow GitHub/LinkedIn/project links

Public visitors must **not** be able to:

- Create/edit projects
- Publish/unpublish projects
- Approve metadata
- Modify project tags
- Change funding goals
- Alter funding totals
- Access private project drafts
- Access private administrative information

### 10.2 Protected operations

The following require authorization:

```text
Create project
Edit project
Approve/edit/remove tags
Publish/unpublish project
Manage funding configuration
```

The protection must exist in the application/server boundary that receives the operation.

### 10.3 Payment security boundary

Payment verification is a separate trust boundary:

```text
Browser / visitor
       |
       | payment request
       v
Payment provider
       |
       | provider result / verification evidence
       v
Application payment boundary
       |
       | verified successful payment only
       v
Funding records / total
```

A browser response such as "Payment successful" is not by itself authoritative.

### 10.4 Sensitive information

Potentially sensitive information includes:

- Authentication credentials/session data
- Payment-provider secrets
- Provider references/status data
- Private project drafts
- Unapproved metadata suggestions

These must stay inside the appropriate protected boundary.

### 10.5 Public/private data leakage rule

The public project/content retrieval path should expose only records intended for public presentation. Private administrative records should not be fetched and then hidden with frontend logic as the primary protection.

### 10.6 Authentication decision

The exact authentication method is intentionally unresolved. The architecture only requires a mechanism that can reliably establish owner identity and authorization for administrative operations.

---

## 11. Application States

Only states required by the Project Map are defined here. Exact storage representation is an implementation decision.

### 11.1 Project publication state

```text
DRAFT / PRIVATE
    |
    | owner completes project information + reviews metadata
    v
PUBLISHED / PUBLIC
    |
    | owner edits or unpublishes
    v
DRAFT / PRIVATE
```

Important rule:

- A new project cannot become public through an automatic tag-suggestion path.
- Owner review/approval of suggestions occurs before publication.

The Project Map explicitly requires public/private status; it does not mandate a larger editorial workflow.

### 11.2 Funding state

Funding behavior can be understood as:

```text
NOT FUNDING-ENABLED
        |
        | owner enables valid funding configuration
        v
FUNDING OPEN
        |
        | verified amount raised >= goal
        v
GOAL REACHED
```

Possible administrative disablement returns the project to `NOT FUNDING-ENABLED`.

Rules:

- Only projects with an active funding goal expose donation functionality.
- `amount raised >= funding goal` causes the system to stop accepting new donations.
- Public presentation changes to **Goal reached**.

### 11.3 Payment state

The architecture must distinguish payment attempts/results from verified funding contribution.

Conceptual states required by the Project Map include:

```text
INITIATED
   |
   +--> PENDING
   |      |
   |      +--> SUCCESSFUL -> VERIFIED -> contributes to funding total
   |      +--> FAILED     -> does not contribute
   |      +--> CANCELLED  -> does not contribute
   |
   +--> FAILED / CANCELLED
```

An application should only treat a successful provider result as funding-bearing after the required verification step.

### 11.4 Visitor personalization state

```text
FIRST VISIT / NOT YET DECIDED
       |
       +--> SKIPPED --> default ranking
       |
       +--> COMPLETED --> stored visitor preferences --> personalized ranking
```

No persistent user-account lifecycle is necessary for this feature in V1.

---

## 12. Configuration & Maintainability

### 12.1 Explicitly data/configuration-driven

The Project Map directly calls for flexibility around:

- Featured project selection
- GitHub metric display threshold
- Project tags
- Funding goals
- Enabled/disabled donation state

These should not require changing application logic for routine portfolio maintenance.

### 12.2 Owner-maintained content

The following should be maintainable without requiring a full CMS architecture:

- Bio
- Education
- Skills
- Achievements
- GitHub URL
- LinkedIn URL

The Project Map leaves the exact storage/edit mechanism open.

### 12.3 What should not be over-configured

Do not introduce admin settings for every visual or behavioral detail merely because configurability is possible.

Examples of things that do not require a separate configuration system unless later requested:

- Every animation parameter
- Every page spacing value
- Every UI label
- Arbitrary recommendation formulas
- A general-purpose workflow engine

### 12.4 Experimental Mode maintainability

Experimental Mode should have its own presentation layer/boundary so that its unresolved storytelling/design can evolve later.

However, it should reuse the same authoritative:

- Project data
- Site content
- Project discovery data
- Funding state
- External links

This avoids maintaining two versions of portfolio truth.

---

## 13. Testing Boundaries

Verification should focus on evidence that each architectural responsibility works, rather than forcing every component into the same test type.

| Component / Feature                 | Appropriate verification                    | Evidence that should convince us                                                                       |
| ----------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Homepage content/order              | End-to-end + manual visual check            | Correct sections appear in the intended order and are understandable without another page              |
| Minimal & Professional presentation | Manual visual check + responsive check      | Comfortable, readable, recruiter-friendly presentation across supported screen sizes                   |
| Experimental Mode boundary          | End-to-end + manual visual check            | Alternative presentation works without changing core project/funding data                              |
| Personalization poll                | Unit/integration + E2E                      | Exactly one visitor type, multi-select interests, skip behavior, first-visit behavior all work         |
| Personalized matching               | Unit + integration                          | Same preferences + same project metadata produce deterministic expected ordering/selection             |
| All-project filtering               | Unit/integration + E2E                      | Combined filters produce the intersection of selected criteria                                         |
| Project detail conditional links    | E2E                                         | Missing GitHub/demo URLs never create empty or misleading actions                                      |
| Project metadata suggestions        | Integration + E2E                           | Suggestions appear, can be edited/removed, and do not publish automatically                            |
| Publication control                 | Integration + security test                 | Unreviewed project/tag data cannot become public; unauthorized users cannot publish                    |
| Admin authentication/authorization  | Security/integration + E2E                  | Anonymous/public requests cannot perform admin operations                                              |
| GitHub integration                  | Integration + external-service verification | Valid metrics are consumed; failures/rate limits do not break portfolio browsing; no fabricated values |
| Funding state calculation           | Unit/integration                            | Progress and goal-reached state match authoritative verified totals                                    |
| Donation flow                       | Integration + payment-provider verification | Successful verified payment contributes; failed/cancelled/abandoned payment does not                   |
| Duplicate payment handling          | Integration                                 | Repeated provider notifications do not double-count the same verified payment                          |
| Goal reached protection             | Integration + E2E                           | New donation cannot be initiated once the goal has been reached                                        |
| Public/private data boundary        | Security/integration                        | Private drafts, admin data, and sensitive payment information are not publicly exposed                 |

### Verification philosophy

A feature is not considered architecturally complete merely because a UI element appears. Verification should demonstrate that the correct component owns the rule and that the important failure cases behave correctly.

---

## 14. Architectural Risks

### Risk 1: Payment verification / duplicate processing

**Why it matters:** Funding totals must remain trustworthy. Payment callbacks may be delayed, replayed, duplicated, or ambiguous.

**Affected component:** Payment Integration + Funding + Persistence.

**Possible mitigation:** Keep a unique provider reference/payment identifier, verify success before crediting, make processing idempotent, and ensure funding updates are consistent under concurrent payments.

### Risk 2: Treating AI-generated tags as truth

**Why it matters:** Incorrect suggestions could silently distort recommendations and filters.

**Affected component:** Metadata Assistant + Admin + Project Discovery.

**Possible mitigation:** Store suggestions separately from approved metadata and require explicit owner review before publication.

### Risk 3: Stale/unavailable GitHub metrics

**Why it matters:** GitHub data can become stale or temporarily unavailable, while project browsing must remain reliable.

**Affected component:** GitHub Integration + Project Discovery + Public Interface.

**Possible mitigation:** Treat GitHub metrics as external/derived data, support missing/stale values gracefully, and avoid making core page availability depend on live GitHub responses.

### Risk 4: Admin protection implemented only in the UI

**Why it matters:** Hiding admin buttons is not authorization. A public client could still attempt the underlying operation.

**Affected component:** Authentication / Authorization + Admin.

**Possible mitigation:** Enforce authorization at the protected application operation boundary and test unauthorized requests directly.

### Risk 5: Core architecture becoming over-engineered

**Why it matters:** A portfolio can become harder to maintain than necessary if every feature becomes a separate service or generic platform.

**Affected component:** Whole system.

**Possible mitigation:** Keep one deployable application with logical modules, add infrastructure only when a real requirement appears, and keep V1 recommendation logic deterministic.

### Risk 6: Experimental Mode diverging from portfolio truth

**Why it matters:** Maintaining two independent data systems would create inconsistent project/funding information.

**Affected component:** Public Interface + Project Content + Project Discovery + Funding.

**Possible mitigation:** Make Experimental Mode another presentation of the same application data and business rules.

---

## 15. Open Architectural Decisions

These remain intentionally unresolved because the Project Map does not provide enough information to finalize them without silently inventing requirements.

### Decision 1: Experimental Mode architecture/details

**Options:**

- Keep it as a second presentation route within the same frontend/application.
- Build a more independent visual shell over shared application services.

**Recommended option:** Shared application/data/business logic with a separate presentation layer for Experimental Mode.

**Reason:** Preserves one source of portfolio truth while allowing the visual experience to evolve substantially.

**Tradeoff:** Some presentation code may be duplicated conceptually, but the duplication should stay at the presentation layer rather than the data/business layer.

**Blocked by:** Exact Experimental Mode storytelling/interface is not yet defined.

### Decision 2: GitHub metric display threshold

**Options:**

- Fixed global threshold.
- Configurable global threshold.
- Project-specific threshold.

**Recommended option:** Configurable global threshold for V1.

**Reason:** The Project Map explicitly requires a configured display threshold and routine maintainability.

**Tradeoff:** Adds one configuration value, but avoids hard-coding a presentation rule.

**Blocked by:** Exact threshold value not decided.

### Decision 3: Payment provider

**Options:** A payment gateway, a supported UPI integration, or another compliant provider that can reliably confirm payment status.

**Recommended option:** Select the simplest provider that supports reliable server-side verification, project-specific payment context, and required donation flows.

**Reason:** Payment correctness is more important than provider sophistication.

**Tradeoff:** Provider-specific integration work creates some coupling; isolate it behind Payment Integration.

**Blocked by:** Provider not selected.

### Decision 4: Admin authentication method

**Options:** A simple owner-only authentication system, a managed identity provider, or another secure mechanism appropriate to the deployment.

**Recommended option:** Use the simplest secure owner-only method supported by the selected implementation environment, with server-side authorization.

**Reason:** V1 needs private administration, not a general identity platform.

**Tradeoff:** A minimal auth design may provide fewer future identity-management capabilities.

**Blocked by:** Exact implementation/deployment context not fixed.

### Decision 5: Personalized relevance weighting

**Options:**

- Simple count of matching tags.
- Weighted categories (visitor type vs interests vs project metadata).
- Owner-curated priority overrides.

**Recommended option:** Start with a deterministic, inspectable matching rule using the available metadata, without introducing machine learning.

**Reason:** The Project Map explicitly says sophisticated ML is unnecessary for V1.

**Tradeoff:** Recommendations may be less nuanced than a learned recommender, but they are easier to understand, test, and maintain.

**Blocked by:** Exact weighting when multiple tags match is not defined.

### Decision 6: GitHub metric refresh strategy

**Options:**

- Scheduled updates.
- Manual refresh.
- Hybrid: scheduled baseline + manual refresh.

**Recommended option:** Scheduled or periodic refresh if the deployment environment supports it simply; otherwise use manual refresh without making the public portfolio dependent on live API calls.

**Reason:** The Project Map already assumes metrics may be fetched periodically.

**Tradeoff:** Stored metrics can be stale between refreshes.

**Blocked by:** Deployment environment and desired freshness.

### Decision 7: Project-page technical detail presentation

**Options:**

- All content visible.
- Technical details under expandable sections.
- Progressive disclosure based on page layout.

**Recommended option:** Use progressive disclosure where it improves scanability while keeping the concise overview visible without interaction.

**Reason:** Recruiters should not have to expand content merely to understand the project, while technical visitors should still be able to go deeper.

**Tradeoff:** Expandable content can hide information from some visitors and adds interaction complexity.

**Blocked by:** Final visual/content design choice.

### Decision 8: Persistence technology

**Options:** A relational database, document-oriented store, or a simpler persistence mechanism if the chosen application environment supports it adequately.

**Recommended option:** Prefer the simplest durable store that cleanly supports project metadata, relationships, funding/payment records, and protected updates. A relational model is a strong default because payment/project relationships and filtering are structured.

**Reason:** The application's core data has clear relationships and requires reliable updates for funding.

**Tradeoff:** A relational database is more infrastructure than a purely static portfolio, but the donation/admin requirements justify durable structured persistence.

**Blocked by:** Implementation/deployment choice.

---

## 16. Requirement → Component Traceability

| Requirement                                                         | Responsible Component           | Supporting Components                     | Verification                                           |
| ------------------------------------------------------------------- | ------------------------------- | ----------------------------------------- | ------------------------------------------------------ |
| Recruiter-friendly homepage identity and work overview              | Public Portfolio Interface      | Site Content, Project Discovery           | E2E + manual visual check                              |
| Homepage section order                                              | Public Portfolio Interface      | Site Content, Project Discovery           | E2E + visual check                                     |
| Small education section                                             | Site Content                    | Public Portfolio Interface                | E2E + visual check                                     |
| Skills/technologies presentation                                    | Site Content                    | Public Portfolio Interface                | E2E                                                    |
| Strongest-project curated set                                       | Project Discovery               | Project Content, GitHub Integration       | Integration + E2E                                      |
| Ranking based on usefulness/impact, GitHub activity, owner judgment | Project Discovery               | Project Content, GitHub Integration       | Unit/integration + editorial review                    |
| No rigid ranking formula required                                   | Project Discovery               | Project Content                           | Architecture review + tests for deterministic behavior |
| Project card fields                                                 | Public Portfolio Interface      | Project Content, GitHub Integration       | E2E                                                    |
| GitHub metrics only above configured threshold                      | Public Portfolio Interface      | GitHub Integration, Project Content       | Unit/integration + E2E                                 |
| Project detail concise overview                                     | Public Portfolio Interface      | Project Content                           | E2E + manual visual check                              |
| Project detail deeper technical information                         | Public Portfolio Interface      | Project Content                           | E2E + manual content check                             |
| Conditional live-demo/GitHub links                                  | Public Portfolio Interface      | Project Content                           | E2E                                                    |
| No empty/irrelevant project actions                                 | Public Portfolio Interface      | Project Content                           | E2E                                                    |
| Automatic first-visit poll                                          | Personalization                 | Public Portfolio Interface, visitor state | E2E                                                    |
| Poll can be skipped                                                 | Personalization                 | Public Portfolio Interface                | E2E                                                    |
| Visitor type exactly one selection                                  | Personalization                 | Public Portfolio Interface                | Unit + E2E                                             |
| Interests are multi-select and unranked                             | Personalization                 | Public Portfolio Interface                | Unit + E2E                                             |
| Personalized matching uses visitor type + interests + project tags  | Project Discovery               | Personalization, Project Content          | Unit + integration + E2E                               |
| Personalized ranking differs from default when relevant             | Project Discovery               | Personalization, Project Content          | Integration/E2E acceptance test                        |
| Load more / view all after personalization                          | Project Discovery               | Public Portfolio Interface                | E2E                                                    |
| All Projects browser                                                | Project Discovery               | Project Content                           | E2E                                                    |
| Filter by domain/interest                                           | Project Discovery               | Project Content                           | Unit/integration                                       |
| Filter by technology                                                | Project Discovery               | Project Content                           | Unit/integration                                       |
| Filter by project type                                              | Project Discovery               | Project Content                           | Unit/integration                                       |
| Combined filters produce intersection                               | Project Discovery               | Project Content                           | Integration + E2E                                      |
| Tag suggestions when adding project                                 | Metadata Assistant              | Admin, Project Content                    | Integration + E2E                                      |
| Owner can edit/remove suggestions                                   | Project Management / Admin      | Metadata Assistant                        | E2E                                                    |
| Owner approval required before publication                          | Project Management / Admin      | Metadata Assistant, Project Content       | Security/integration + E2E                             |
| Only funded projects show donation option                           | Funding                         | Project Content, Public Interface         | E2E                                                    |
| Dedicated funding page                                              | Funding                         | Public Interface, Project Content         | E2E                                                    |
| Funding goal shown                                                  | Funding                         | Public Interface                          | E2E                                                    |
| Amount raised shown                                                 | Funding                         | Payment Integration, Persistence          | Integration + E2E                                      |
| Funding progress shown                                              | Funding                         | Public Interface                          | Unit/E2E                                               |
| Funding explanation shown                                           | Funding                         | Project Content, Public Interface         | E2E                                                    |
| UPI/payment gateway option                                          | Funding                         | Payment Integration                       | Integration + provider verification                    |
| Only verified successful payments increase total                    | Funding                         | Payment Integration, Persistence          | Integration + payment verification                     |
| Failed payments do not increase total                               | Funding                         | Payment Integration                       | Integration                                            |
| Cancelled/abandoned payments do not increase total                  | Funding                         | Payment Integration                       | Integration                                            |
| Donations stop automatically at goal                                | Funding                         | Payment Integration, Project Content      | Integration + E2E                                      |
| Goal reached state shown                                            | Funding                         | Public Portfolio Interface                | E2E                                                    |
| No additional donation transaction after goal                       | Funding                         | Payment Integration, Public Interface     | Integration + E2E                                      |
| Private admin area                                                  | Project Management / Admin      | Authentication / Authorization            | Security/E2E                                           |
| Admin manages projects                                              | Project Management / Admin      | Project Content                           | E2E                                                    |
| Admin manages metadata                                              | Project Management / Admin      | Metadata Assistant, Project Content       | E2E                                                    |
| Admin manages funding information                                   | Project Management / Admin      | Funding, Project Content                  | E2E                                                    |
| Unauthorized visitors cannot access admin functions                 | Authentication / Authorization  | Admin                                     | Security/integration + E2E                             |
| Private administrative information must not leak                    | Authentication / Authorization  | Project Content, Admin, Persistence       | Security/integration                                   |
| GitHub repository links                                             | GitHub Integration              | Project Content, Public Interface         | Integration + E2E                                      |
| GitHub metrics/activity                                             | GitHub Integration              | Project Discovery, Public Interface       | External-service verification + integration            |
| LinkedIn connection                                                 | Public Portfolio Interface      | Site Content                              | E2E/link verification                                  |
| Minimal & Professional default experience                           | Public Portfolio Interface      | Site Content, Project Discovery           | Manual visual + responsive check                       |
| Experimental Mode exists as alternative experience                  | Public Portfolio Interface      | Shared application components             | E2E + manual visual check                              |
| Experimental Mode details remain flexible                           | Public Portfolio Interface      | Shared data/business components           | Architecture review                                    |
| Featured selection configurable                                     | Project Content                 | Project Discovery, Admin                  | Integration + E2E                                      |
| GitHub metric threshold configurable                                | Project Content / configuration | GitHub Integration, Public Interface      | Configuration test + E2E                               |
| Project tags maintainable                                           | Project Content                 | Admin, Metadata Assistant                 | E2E                                                    |
| Funding goals configurable                                          | Funding                         | Admin, Project Content                    | E2E                                                    |
| Donation enabled/disabled state configurable                        | Funding                         | Admin, Project Content                    | E2E                                                    |
| No work-experience section required                                 | Public Portfolio Interface      | Site Content                              | Visual/content review                                  |
| No ordinary visitor accounts required                               | Personalization                 | Public Interface                          | Architecture review                                    |
| No complex recommendation AI required                               | Project Discovery               | Project Content                           | Architecture review + deterministic matching tests     |
| No rigid numerical project scoring required                         | Project Discovery               | Project Content, GitHub Integration       | Architecture review                                    |

---

## Architecture Consistency Check

### Coverage

Every major requirement in the Project Map has an architectural home. The detailed mapping appears in Section 16.

### Dependency clarity

The major communication paths are explicit:

```text
Public UI -> Application components -> Persistence / External services
Admin -> Authentication -> Protected application operations
Metadata Assistant -> Admin review -> Approved Project Content
Payment Provider -> Payment Verification -> Funding -> Persistence
GitHub -> GitHub Integration -> Public/Discovery use
```

### Data clarity

The architecture distinguishes:

- authoritative owner-approved data
- authoritative external data
- derived application state
- non-authoritative AI/system suggestions

This is especially important for tags, GitHub metrics, and payment results.

### Security

Public and private operations have distinct boundaries. Administrative authorization is enforced at the protected operation boundary rather than by UI visibility alone.

### Failure handling

Important failures are covered for:

- payment verification
- duplicate/replayed payments
- payment cancellation/failure
- funding goal completion
- GitHub unavailability/rate limits
- invalid or missing project metadata
- unauthorized administration
- incomplete/invalid metadata suggestions

### Simplicity

The architecture intentionally avoids:

- microservices
- distributed queues
- unnecessary caching infrastructure
- general-purpose CMS architecture
- complex recommender AI
- ordinary visitor accounts
- social/messaging systems

The only durable application complexity justified by the current requirements is structured project/admin/funding/payment state.

### Traceability

A future coding agent should be able to move from:

```text
Requirement
   -> Responsible component
   -> Supporting components
   -> Data/external dependency
   -> Business/security rule
   -> Verification evidence
```

without needing to invent a missing major subsystem.

---

## Final Architectural Contract

Another AI should treat this document as the architectural contract for implementation, while treating `PROJECT_MAP.md` as the product/requirements specification.

The contract establishes **what internal responsibilities exist, where important rules belong, what data is authoritative, how the components interact, and what must be verified**.

It deliberately does **not** prescribe:

- application source code
- exact implementation files
- exact folder structure
- exact framework
- exact database vendor
- exact payment provider
- exact authentication implementation
- exact Experimental Mode design
- exact recommendation weights

Those choices belong to the implementation stage, constrained by this architecture and the Project Map.
