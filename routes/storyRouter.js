const router= require('express').Router();

const { getStories, getStory, createStory, deleteStory, updateStory, getSingleStory, getallstories}= require ("../controller/story");


router.route("/").get(getStories).post(createStory);
router
.route("/:storyId")
.get(getStory)
.patch(updateStory)
.delete(deleteStory);


router.get('/test', getallstories)
router.get('/all/:storyId', getSingleStory  )

module.exports = router;