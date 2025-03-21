const express = require('express');

module.exports = function (client) {
    const router = express.Router();
    const db = client.db("todoDB");
    const tasksCollection = db.collection("tasks");

    router.post('/', async (req, res) => {
        try {
            console.log(req.body); 
    
            const { title = null, description = null, dueDate = null, priority } = req.body;
    
            const newTask = { title, description, dueDate, priority, status: "not done" };
            const result = await tasksCollection.insertOne(newTask);
    
            res.status(201).json({ message: "Task created", taskId: result.insertedId });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    router.get('/', async (req, res) => {
        try {
            const { status, priority, page = 1, limit = 10 } = req.query;
            let query = {};
            if (status) query.status = status;
            if (priority) query.priority = priority;

            const tasks = await tasksCollection.find(query)
                .skip((page - 1) * limit)
                .limit(parseInt(limit))
                .toArray();

            res.json(tasks);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    router.put('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const { title, description, dueDate, priority, status } = req.body;
            const updateFields = { title, description, dueDate, priority, status };
            const result = await tasksCollection.updateOne(
                { _id: new require('mongodb').ObjectId(id) },
                { $set: updateFields }
            );

            if (result.matchedCount === 0) {
                return res.status(404).json({ message: "Task not found" });
            }

            res.json({ message: "Task updated" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    router.delete('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const result = await tasksCollection.deleteOne({ _id: new require('mongodb').ObjectId(id) });

            if (result.deletedCount === 0) {
                return res.status(404).json({ message: "Task not found" });
            }

            res.json({ message: "Task deleted" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    return router;
};
