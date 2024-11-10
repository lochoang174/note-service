const express = require('express');
const router = express.Router();
const Note = require('../models/Note'); // Thay đổi model thành Note
const Sharing = require('../models/Sharing');
const { sendQueueWithPayload } = require('../queue/queueWithPayload');
// 1. API tạo note mới
router.post('/', async (req, res) => {
    try {
        const { title, content, owner,status } = req.body;
        const note = new Note({
            title,
            content,
            owner,
            status
        });
        await note.save();
        res.status(201).json({ message: 'Note created successfully', note });
    } catch (error) {
        res.status(500).json({ message: 'Error creating note', error: error.message });
    }
});

// 2. API cập nhật note
router.put('/:id', async (req, res) => {
    try {
        const { title, content } = req.body;
        const note = await Note.findByIdAndUpdate(
            req.params.id,
            { title, content },
            { new: true }
        );
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.json({ message: 'Note updated successfully', note });
    } catch (error) {
        res.status(500).json({ message: 'Error updating note', error: error.message });
    }
});

// 3. API xóa note
router.delete('/:id', async (req, res) => {
    try {
        const note = await Note.findByIdAndDelete(req.params.id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.json({ message: 'Note deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting note', error: error.message });
    }
});

// 4. API lấy danh sách note của owner
router.get('/:ownerId', async (req, res) => {
    try {
        const notes = await Note.find({ owner: req.params.ownerId });
        if(notes.length == 0){
            return res.status(404).json({ message: 'Note not found' });
        }
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notes', error: error.message });
    }
});

// 5. API lấy danh sách note được share
router.get('/shared-notes/:userId', async (req, res) => {
    try {
        const notes = await Sharing.findById({id:req.params.userId}).populate('notes');
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching shared notes', error: error.message });
    }
});
router.post('/share', async (req, res) => {
    const { email, noteId } = req.body;
    try {
        const note = await Note.findById(noteId).exec();

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        const ownerId = await note.owner; // Lấy ra ownerId từ note

        await sendQueueWithPayload({ email, noteId, ownerId }); // Truyền ownerId vào payload


        res.json({ message: 'Shared successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
