# Workout Tracker

This repository contains **two implementations** of a Workout Tracker application, built for learning and comparison purposes as part of a *User Interface Programming* course.

## 📁 Project Structure

```
workout-tracker/
├── react-app/   # Minimal React implementation
└── angular-app/ # Advanced Angular implementation
```

---

## ⚛️ React Version (Minimal)

The **React app** is a **lightweight, minimal implementation** of the core idea.

### Key Characteristics

* Built with **React + Vite**
* Focused on **basic CRUD functionality** (Create, Read, Update, Delete)
* Uses `useState` for local state management
* Simple component structure
* Modern UI with responsive design

### Purpose

This version demonstrates **fundamental React concepts**:

* Component-based architecture
* Unidirectional data flow
* Local state management
* Conditional and list rendering

---

## 🅰️ Angular Version (Advanced)

The **Angular app** is a **feature-complete and more complex implementation** of the Workout Tracker.

### Key Features

* Built with **Angular (Standalone Components)**
* Uses **Angular Signals** for reactive state management
* Full **authentication system** (login & signup)
* User-specific data persistence via `localStorage`
* Advanced **CRUD operations** for workouts
* Workout categorization (Push, Pull, Legs, Cardio, etc.)
* Profile page with progress tracking
* Favorites system
* Responsive UI with modern UX patterns

### Architecture Highlights

* Clear separation of concerns (models, services, pages, components)
* Centralized state logic in services
* Route-based navigation with conditional UI rendering

### Purpose

This version showcases **advanced Angular concepts**:

* Reactive programming with Signals
* Scalable application architecture
* State persistence and multi-user logic
* Rich UI/UX interactions

---

## 🎯 Goal of the Repository

The main goal of this project is to **compare two frontend approaches**:

* A **minimal React solution** focused on simplicity
* A **complex Angular solution** focused on scalability and architecture

Both applications solve the same problem but at **different levels of complexity**, making this repository useful for learning, comparison, and demonstration purposes.

---

## 🛠️ Technologies Used

* React
* Angular
* TypeScript
* JavaScript
* HTML5 / CSS3
* Vite

---

## 📌 Notes

This project is **frontend-only**. All data is stored locally in the browser using `localStorage`.

---

Feel free to explore both implementations and compare their structure, complexity, and development patterns.
