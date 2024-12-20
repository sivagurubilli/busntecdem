const responsesCommon = require("../../common/response.common");
const CourseContent = require("../../models").CourseContent;
const businessusers = require("../../models").businessusers;
const { Sequelize } = require("sequelize");

const getPopularCourses = async (req, res) => {
    const { offset = 0, limit = 10 } = req.query;
    // console.log("Current Offset:", offset);

    try {
        const popularCourses = await CourseContent.findAll({
            where: { status: "1" },
            attributes: {
                include: [
                    [
                        Sequelize.literal(`(
                            SELECT COALESCE(AVG(stars), 0)
                            FROM bo_course_reviews AS reviews
                            WHERE reviews.course_id = CourseContent.id
                        )`),
                        "average_rating",
                    ],
                ],
            },
            include: [
                {
                    model: businessusers,
                    as: "owner",
                    required: true,
                },
            ],
            order: [
                [Sequelize.literal("average_rating"), "DESC"],
                ["purchased_count", "DESC"],
            ],
            offset: parseInt(offset, 10),
            limit: parseInt(limit, 10),
        });

        if (popularCourses.length === 0) {
            return res.status(200).send(
                responsesCommon.apiformatSuccessMessage(
                    "No more courses available",
                    []
                )
            );
        }

        return res.status(200).send(
            responsesCommon.apiformatSuccessMessage(
                "Courses fetched successfully",
                popularCourses
            )
        );
    } catch (error) {
        console.error("Error fetching popular courses:", error);
        return res.status(400).send(
            responsesCommon.formatErrorMessage(error?.message, 400, null)
        );
    }
};
module.exports = {
    getPopularCourses,
};
