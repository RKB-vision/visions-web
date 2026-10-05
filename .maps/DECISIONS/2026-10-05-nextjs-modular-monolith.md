DECISION: Use Next.js with TypeScript as the application runtime and presentation framework.
DATE: 2026-10-05
REASON: The portfolio needs public pages and protected administrative routes in one deployable application. Next.js provides a maintained server-rendered web runtime, route organization, and a straightforward standalone production build without introducing separate frontend and backend services.
ALTERNATIVES CONSIDERED: A separate SPA and API; a smaller custom Node server; a static-site generator. The first adds unnecessary deployment and boundary complexity, while the latter options require more application plumbing for protected operations and future payment verification.
TRADEOFF: The application is coupled to the Next.js runtime and its conventions, but the business logic remains outside route components so the coupling is limited to presentation/bootstrap concerns.
AFFECTED COMPONENTS: Public Portfolio Interface, Project Management/Admin presentation boundary, application bootstrap, local development, deployment.
