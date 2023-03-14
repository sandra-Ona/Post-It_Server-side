const router= require('express').Router();

const { getSingleStory, getallstories}= require ("../controller/story");


router.get('/', getallstories)
router.get('/:storyId', getSingleStory  )

module.exports = router;