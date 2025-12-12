import React, { useState } from "react";

export default function WorkoutManager() {
  const [workouts, setWorkouts] = useState([]);
  const [newWorkout, setNewWorkout] = useState({ name: "", sets: "", reps: "" });
  const [editingId, setEditingId] = useState(null);
  const [editedWorkout, setEditedWorkout] = useState({ name: "", sets: "", reps: "" });

  const handleAddWorkout = () => {
    if (!newWorkout.name || !newWorkout.sets || !newWorkout.reps) return;
    const newItem = {
      id: Date.now(),
      ...newWorkout,
    };
    setWorkouts([...workouts, newItem]);
    setNewWorkout({ name: "", sets: "", reps: "" });
  };

  const handleDelete = (id) => {
    setWorkouts(workouts.filter((w) => w.id !== id));
  };

  const handleEdit = (workout) => {
    setEditingId(workout.id);
    setEditedWorkout(workout);
  };

  const handleSave = () => {
    setWorkouts(workouts.map((w) => (w.id === editingId ? editedWorkout : w)));
    setEditingId(null);
  };

  return (
    <div className="workout-manager">
      <h1 className="title">
        My <span>Workouts</span>
      </h1>

      <div className="add-form">
        <input
          type="text"
          placeholder="Exercise"
          value={newWorkout.name}
          onChange={(e) => setNewWorkout({ ...newWorkout, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Sets"
          value={newWorkout.sets}
          onChange={(e) => setNewWorkout({ ...newWorkout, sets: e.target.value })}
        />
        <input
          type="number"
          placeholder="Reps"
          value={newWorkout.reps}
          onChange={(e) => setNewWorkout({ ...newWorkout, reps: e.target.value })}
        />
        <button className="add-btn" onClick={handleAddWorkout}>
          ➕ Add
        </button>
      </div>

      {workouts.length === 0 ? (
        <p className="empty">No workouts yet.</p>
      ) : (
        <div className="workout-list">
          {workouts.map((w) => (
            <div key={w.id} className="workout-card">
              {editingId === w.id ? (
                <div className="edit-form">
                  <input
                    type="text"
                    value={editedWorkout.name}
                    onChange={(e) =>
                      setEditedWorkout({ ...editedWorkout, name: e.target.value })
                    }
                  />
                  <input
                    type="number"
                    value={editedWorkout.sets}
                    onChange={(e) =>
                      setEditedWorkout({ ...editedWorkout, sets: e.target.value })
                    }
                  />
                  <input
                    type="number"
                    value={editedWorkout.reps}
                    onChange={(e) =>
                      setEditedWorkout({ ...editedWorkout, reps: e.target.value })
                    }
                  />
                  <button className="save" onClick={handleSave}>
                    💾 Save
                  </button>
                  <button className="cancel" onClick={() => setEditingId(null)}>
                    ✖ Cancel
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    <h3>{w.name}</h3>
                    <p>
                      Sets: <span>{w.sets}</span> | Reps: <span>{w.reps}</span>
                    </p>
                  </div>
                  <div className="actions">
                    <button className="edit" onClick={() => handleEdit(w)}>
                      ✏️
                    </button>
                    <button className="delete" onClick={() => handleDelete(w.id)}>
                      🗑️
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
