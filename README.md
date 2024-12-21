# KanFlow

KanFlow is a modern desktop application built with Next.js and Tauri, combining web technologies with native performance to deliver a seamless user experience.

## Technologies

- **Frontend**: [Next.js](https://nextjs.org/) 14
- **Desktop Framework**: [Tauri](https://tauri.studio/) 2.0
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://shadcn.com/)
- **State Management**: React Context API
- **Database**: [SQLite](https://www.sqlite.org/) (via Tauri SQL Plugin)

## Features

- **Responsive UI** with dark and light theme support
- **Authentication System** for secure access
- **Dashboard Interface** for data visualization
- **Board Management** to organize tasks and projects
- **Cross-Platform Support** for Windows, macOS, and Linux
- **Local Data Persistence** ensuring data is stored securely on the user's machine

## Project Structure

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) v14 or later
- [Bun](https://bun.sh/) package manager
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

3. **Setup Environment Variables**

    Create a `.env` file in the root directory and add the necessary environment variables.

4. **Run the Development Server**

    ```sh
    bun dev
    ```

## Usage

### Running the Application

```sh
bun run tauri dev
```

## Contributing
Contributions are welcome! Please fork the repository and create a pull request with your changes.