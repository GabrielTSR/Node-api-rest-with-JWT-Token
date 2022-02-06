const express = require('express');
const authMiddleware = require('../middlewares/auth');

const Project = require('../models/Project');
const Task = require('../models/Task');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().populate(['user', 'task']);

        return res.send({ projects });
    } catch (err) {
        return res.status(400).send({ error: 'Error when loading projects' });
    }
});

router.get('/:projectId', async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId).populate(['user', 'task']);

        return res.send({ project });
    } catch (err) {
        return res.status(400).send({ error: 'Error when loading project' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { title, description, tasks } = req.body;

        const project = await Project.create({ title, description, user: req.userId });

        await Promise.all(
            tasks.map(async (task) => {
                const projectTask = new Task({ ...task, project: project._id }); //New Task não salva na hora, diferente de Task.create

                await projectTask.save();

                project.tasks.push(projectTask);
            })
        );

        await project.save();

        return res.send({ project });
    } catch (err) {
        return res.status(400).send({ error: 'Error when creating a new project' });
    }
});

router.put('/:projectId', async (req, res) => {
    try {
        const { title, description, tasks } = req.body;

        const project = await Project.findByIdAndUpdate(
            req.params.projectId,
            {
                title,
                description,
            },
            {
                new: true, //Para não enviar a versão que estava antes de atualizar, e sim a atual.
            }
        );

        project.tasks = [];
        await Task.remove({ project: project._id });

        await Promise.all(
            tasks.map(async (task) => {
                const projectTask = new Task({ ...task, project: project._id }); //New Task não salva na hora, diferente de Task.create

                await projectTask.save();

                project.tasks.push(projectTask);
            })
        );

        await project.save();

        return res.send({ project });
    } catch (err) {
        return res.status(400).send({ error: 'Error when updating a new project' });
    }
});

router.delete('/:projectId', async (req, res) => {
    try {
        await Project.findByIdAndRemove(req.params.projectId);

        return res.send();
    } catch (err) {
        return res.status(400).send({ error: 'Error when loading project' });
    }
});

module.exports = router;
