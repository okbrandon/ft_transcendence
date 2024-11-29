<h1 align="center">🏓 ft_transcendence</h1>

<p align="center">
	<b><i>ft_transcendence is the ultimate common core project from the 42 School that challenges you to build a feature-rich web application from scratch, inspired by the classic game Pong.</i></b><br>
</p>

<p align="center">
	<img alt="Top used language" src="https://img.shields.io/github/languages/top/okbrandon/ft_transcendence?color=success"/>
	<img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/okbrandon/ft_transcendence"/>
</p>

## 📚 Table of Contents

- [📚 Table of Contents](#-table-of-contents)
- [📣 Introduction](#-introduction)
- [📦 Installation](#-installation)
- [📝 Usage](#-usage)
- [🎮 Features](#-features)
- [📎 References](#-references)

## 📣 Introduction

**ft_transcendence** is a full-stack project where the goal is to create an online platform for playing the classic game Pong, complete with modern enhancements. This project required implementing:

- A real-time multiplayer gaming experience.
- A robust backend and responsive frontend.
- Key features like matchmaking, tournaments, user authentication, and more.

This was a capstone project for the 42 School Common Core, pushing the boundaries of creativity, technical expertise, and software engineering.

## 📦 Installation

> [!WARNING]
> Ensure you have Docker installed and configured properly before proceeding. The project is designed to run in a containerized environment.

1. Clone the repository from GitHub:
   ```sh
   git clone https://github.com/okbrandon/ft_transcendence.git
   ```

2. Build and run the project:
   ```sh
   make
   ```

> [!NOTE]
> This command will set up the entire environment, including the frontend, backend, and database, as specified in the project requirements.
> The frontend should be accessed by your computer hostname followed by the port 8888, like so: `https://hostname:8888`

## 📝 Usage

Here are the main commands for managing the project:

- **Start the application**
  ```sh
  make up
  ```

- **Stop the application**
  ```sh
  make down
  ```

- **Clean the application**
  ```sh
  make fclean
  ```

- **Access logs**
  ```sh
  make [logs|logs-backend|logs-frontend|logs-statcruncher|logs-harvester|logs-postgres]
  ```

## 🎮 Features

Our **ft_transcendence** project includes the following features:

1. **Real-Time Pong Game**
   - Play Pong online against other players or AI opponents.
   - Supports remote gameplay with real-time synchronization.
2. **User Authentication**
   - OAuth2 integration for secure sign-in (e.g., 42 intra authentication).
   - Two-factor authentication (2FA) for enhanced security.
3. **User Profiles and GDPR Compliance**
   - View match history, statistics, and achievements.
   - Add friends, track their online status, and manage personal data in compliance with GDPR.
4. **Live Chat**
   - Real-time messaging with other players.
   - Invite friends to matches via chat.
5. **Multilingual Support**
   - Interface available in multiple languages to cater to a diverse audience.
6. **3D Graphics**
   - Enhanced visuals with Three.js/WebGL for an immersive gaming experience.
7. **Server-Side Pong**
   - Backend-controlled gameplay logic with API integration for seamless interaction.
8. **Backend and Database**
   - Robust backend built with Django and PostgreSQL for data management and scalability.
9. **AI Opponent**
   - Intelligent AI players to challenge users, adding depth to single-player mode.

## 📎 References

- [Docker Documentation](https://docs.docker.com/)
- [Pong History](https://en.wikipedia.org/wiki/Pong)

and some more docs...

[⬆ Back to Top](#-table-of-contents)

## 🌏 Meta

**evmorvan** - evmorvan@student.42nice.fr<br>
**hanmpark** - hanmpark@student.42nice.fr<br>
**kquetat-** - kquetat-@student.42nice.fr<br>
**bsoubaig** – bsoubaig@student.42nice.fr<br>
