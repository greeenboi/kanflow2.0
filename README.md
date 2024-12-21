# KanFlow

KanFlow is a modern desktop application built with Next.js and Tauri, combining web technologies with native performance to deliver a seamless user experience.

## Contents
1) [Features and USP](https://github.com/greeenboi/kanflow2.0/edit/master/README.md#features-and-usp)
2) [Gallery](https://github.com/greeenboi/kanflow2.0/edit/master/README.md#gallery)
3) [What We Used](https://github.com/greeenboi/kanflow2.0/edit/master/README.md#what-we-used)
4) [Installation](https://github.com/greeenboi/kanflow2.0/edit/master/README.md#installation)
5) [Contribution](https://github.com/greeenboi/kanflow2.0/edit/master/README.md#contribution)

## Features and USP

Kanflow offers a unique, offline only approach to storing and managing your data to provide the absolute fastest speeds and no chance of data leaks. 
It also offers several exciting features:
- Delectably custom themes
- Anonymous Login as a guest user
- Multiple Users in a single device
- Intuitive Keybinds and Shortcuts
- Notifications and Reminders (Coming Soon!)
- Completely customizable boards and tasks.
- and more..

## Gallery
![Screenshot 2024-12-22 004444](https://github.com/user-attachments/assets/77cc5d0f-f730-4210-8062-3e85fd9e4ac6)
![Screenshot 2024-12-22 004450](https://github.com/user-attachments/assets/9841b392-7954-4daa-be9c-edaceb02e1c8)
![Screenshot 2024-12-22 004842](https://github.com/user-attachments/assets/1a6fa874-8d4f-4aa6-9c7e-b5666196e64d)
![Screenshot 2024-12-22 004851](https://github.com/user-attachments/assets/73132ef8-77fb-4830-8221-565cda77b15c)
![Screenshot 2024-12-22 004906](https://github.com/user-attachments/assets/c36b605a-cb84-4b0c-8b79-3664ae933923)
![Screenshot 2024-12-22 005014](https://github.com/user-attachments/assets/034cca3d-4c19-4ff7-804c-0a84e18c6fab)

## What We Used

- **Frontend**: [Next.js](https://nextjs.org/) 14
- **Desktop Framework**: [Tauri](https://tauri.studio/) 2.0
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://shadcn.com/) & [Magic UI](https://magicui.design/)
- **State Management**: [Tauri Store Plugin](https://tauri.app/plugin/store/)
- **Database**: [SQLite](https://www.sqlite.org/) (via Tauri SQL Plugin)
  

## Installation

Installing Kanflow is very simple:
1) Visit the [Releases tab](https://github.com/greeenboi/kanflow2.0/releases/tag/v0.2.0)
2) Download the .msi Installer in your preffered language (English,French,Portuguese)
3) Have fun!!

***

## Contribution
### Prerequisites

- [Node.js](https://nodejs.org/) v14 or later
- [Bun](https://bun.sh/) package manager
- [Yarn](https://yarnpkg.com) package manager (Building only)
- [Rust](https://www.rust-lang.org/tools/install) and [Cargo](https://doc.rust-lang.org/cargo/getting-started/installation.html)
- [Tauri CLI](https://tauri.studio/docs/getting-started/intro) installed globally

### Steps

1. **Clone the Repository**

    ```sh
    git clone https://github.com/your-username/kanflow.git
    cd kanflow
    ```

2. **Install Dependencies**

    ```sh
    bun install
    ```

3. **Run the Development Server**

    ```sh
    bun run tauri dev
    ```



## Contributing
Contributions are welcome! Please fork the repository and create a pull request with your changes.
