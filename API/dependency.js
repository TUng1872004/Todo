const express = require('express');
const { ObjectId } = require('mongodb');

module.exports = function (client) {
    const router = express.Router();
    const db = client.db("todoDB");
    const tasksCollection = db.collection("tasks");

    router.post('/:taskId/dependencies/:dependencyId', async (req, res) => {
        try {
            const { taskId, dependencyId } = req.params;
            const result = await tasksCollection.updateOne(
                { _id: new ObjectId(taskId) },
                { $addToSet: { dependencies: new ObjectId(dependencyId) } }
            );
            res.status(200).json({ message: "Dependency added", modifiedCount: result.modifiedCount });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    router.delete('/:taskId/dependencies/:dependencyId', async (req, res) => {
        try {
            const { taskId, dependencyId } = req.params;
            const result = await tasksCollection.updateOne(
                { _id: new ObjectId(taskId) },
                { $pull: { dependencies: new ObjectId(dependencyId) } }
            );
            res.status(200).json({ message: "Dependency removed", modifiedCount: result.modifiedCount });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    router.get('/:taskId/dependencies', async (req, res) => {
        try {
            const { taskId } = req.params;
            const task = await tasksCollection.findOne({ _id: new ObjectId(taskId) });
            if (!task) return res.status(404).json({ error: "Task not found" });
            const dependencies = await tasksCollection.find({ _id: { $in: task.dependencies || [] } }).toArray();
            res.json(dependencies);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    return router;
};
