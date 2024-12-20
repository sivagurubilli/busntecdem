const CourseContent = require("../../models").CourseContent;
const { Sequelize } = require("sequelize");
const responsesCommon = require("../../common/response.common");
const getFooterCourse = async(req,res) =>{

    try {
        
            const footerCourses = await CourseContent.findAll({
                where: { status: "1" },
                attributes: [
                    "uuid",
                    "course_title",
                    [
                        Sequelize.literal(`(
                            SELECT COALESCE(AVG(stars), 0)
                            FROM bo_course_reviews AS reviews
                            WHERE reviews.course_id = CourseContent.id
                        )`),
                        "average_rating", 
                    ],
                ],
              
                order: [
                    [Sequelize.literal("average_rating"), "DESC"],
                    ["purchased_count", "DESC"],
                ],
                limit: 5,
            });
            return res.status(200).send(
                responsesCommon.apiformatSuccessMessage(
                    "Courses fetched successfully",
                    footerCourses
                )
            );

    } catch (error) {
        console.error("Error fetching footer courses:", error);
        return res.status(400).send(
            responsesCommon.formatErrorMessage(error?.message, 400, null)
        );
    }
}

module.exports = getFooterCourse