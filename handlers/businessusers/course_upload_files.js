const responsesCommon = require('../../common/response.common');
const courseContent = require("../../models").CourseContent;
const CourseSections = require("../../models").CourseSections;
const courseUploads = require("../../models").courseUploads;
const businessusers = require("../../models").businessusers;
const couresReviews = require("../../models").couresReviews;
const reviewManage = require("../../models").reviewManage;
const userCourseProgress = require("../../models").userCourseProgress;
const userCertificateTable = require('../../models').userCertificates;
const getPreSignedUrl = require('../../middleware/awsUpload').getFilesFromS3;
const deleteFileFromS3 = require('../../middleware/awsUpload').deleteFileFromS3;
const { v4: uuidv4 } = require('uuid');
const { Op, Model } = require('sequelize');
const xlsx = require('xlsx');


async function uploadCourseFiles(req, res) {
    try {
        const updatedFilesNames = req.files.map((items) => {
            return { ...items, filename: `${process.env.APP_NODE_URL}/bo-images/${items?.filename}` }
        })
        res.json(updatedFilesNames);
    } catch (error) {
        console.error(error);
    }
}


async function uploadCourseThumbnail(req, res) {
    try {
        res.json({
            ...req.file, filename: `${process.env.APP_NODE_URL}/bo-images/${req.file.filename}`
        })
    } catch (error) {
        console.error(error);
        res.json({})
    }
}

async function uploadCourseFiles(req, res) {
    try {
        const updatedFilesNames = req.files.map((items) => {
            return { ...items, filename: `${process.env.APP_NODE_URL}/bo-images/${items?.filename}` }
        })
        res.json(updatedFilesNames);
    } catch (error) {
        console.error(error);
        res.json([])
    }
}
async function uploadCourse(req, res) {
    try {
        const bodyData = req.body;

        const { sectionDetails, uuid } = bodyData
        delete bodyData?.sectionDetails;
        if (!!bodyData?.uuid) { //if uuid is there it means a course is exist
            //update course
            bodyData.course_requirements = bodyData?.courseRequirements;
            bodyData.course_features = bodyData?.courseIncludes;
            bodyData.course_offers = bodyData?.courseOffer;
            const updatedCourse = await courseContent.update(bodyData, { where: { uuid } });
            if (updatedCourse[0] > 0) {
                sectionDetails.forEach(async (element) => {
                    if (element?.uuid) {
                        const updateSections = await CourseSections.update(element, {
                            where: {
                                uuid: element?.uuid
                            }
                        });
                        if (updateSections[0] > 0) {
                            //updating courseSubSections;
                            element?.courseSubSections.forEach(async (subSection) => {

                                delete subSection?.id
                                const filteredResourceList = subSection?.resourceList.filter((rItems) => rItems?.title !== "" || rItems?.link !== "") || []
                                const concatDataResourceLink = filteredResourceList.map((items) => `${items?.title}~${items?.link}`).join("|") || ""
                                subSection.resources_list = concatDataResourceLink;


                                const filteredExternalUrls = subSection?.externalUrls.filter((rItems) => rItems?.title !== "" || rItems?.link !== "")
                                const concatDataExternalUrls = filteredExternalUrls.map((items) => `${items?.title}~${items?.link}`).join("|") || ""
                                subSection.external_urls_videos = concatDataExternalUrls;

                                const concatExternalResources = subSection?.externalResources?.map((items) => `${items?.fileName}~${items?.fileUrl}`).join("|") || ""
                                subSection.external_resources = concatExternalResources;


                                delete subSection.resourceList;
                                delete subSection.externalUrls;
                                delete subSection.externalResources;
                                if (!!subSection?.uuid) {
                                    //update subsection
                                    await courseUploads.update(subSection, {
                                        where: {
                                            uuid: subSection?.uuid
                                        }
                                    })
                                } else {
                                    //create subsection
                                    subSection.section_id = element?.id
                                    subSection.uuid = uuidv4();
                                    await courseUploads.create(subSection);
                                }
                            })

                        }
                    } else {
                        delete element?.id;
                        element.course_id = bodyData?.id;
                        element.uuid = uuidv4();
                        const createdSection = await CourseSections.create(element);
                        const section_id = createdSection?.id
                        if (section_id) {
                            const updateCourseSubSections = element.courseSubSections.map((items) => {
                                const filteredResourceList = items?.resourceList.filter((rItems) => rItems?.title !== "" || rItems?.link !== "") || []
                                const concatDataResourceLink = filteredResourceList.map((items) => `${items?.title}~${items?.link}`).join("|") || ""
                                const filteredExternalUrls = items?.externalUrls.filter((rItems) => rItems?.title !== "" || rItems?.link !== "");
                                const concatDataExternalUrls = filteredExternalUrls.map((items) => `${items?.title}~${items?.link}`).join("|") || ""
                                const concatExternalResources = items?.externalResources?.map((items) => `${items?.fileName}~${items?.fileUrl}`).join("|") || ""
                                delete items?.resourceList;
                                delete items?.externalUrls
                                delete items?.externalResources;
                                delete items?.isExpand;
                                items.uuid = uuidv4();
                                return {
                                    ...items,
                                    section_id: section_id,
                                    resource_list: concatDataResourceLink,
                                    external_urls_videos: concatDataExternalUrls,
                                    external_resources: concatExternalResources,
                                }
                            })
                            const bulkCreated = await courseUploads.bulkCreate(updateCourseSubSections);
                        }
                    }
                });

                return res.status(200).send(responsesCommon.formatSuccessMessage('Course updated successfully!', null, null, null, 200));
            }
            return res.status(400).send(responsesCommon.formatErrorMessage("Failed to update!", 400, null));



        } else {
            bodyData.uuid = uuidv4();
            const createdCourse = await courseContent.create(bodyData);
            if (!!createdCourse?.id) {
                if (sectionDetails.length > 0) {
                    sectionDetails.map(async (secs) => {
                        delete secs.id;
                        const { courseSubSections } = secs;
                        delete secs.courseSubSections;
                        secs['course_id'] = createdCourse?.id;
                        secs['uuid'] = uuidv4();
                        const createdSections = await CourseSections.create(secs);
                        if (createdSections?.id) {
                            if (courseSubSections?.length > 0) {
                                courseSubSections.map(async (course) => {
                                    delete course.id;
                                    course['uuid'] = uuidv4();
                                    const filteredResourceList = course?.resourceList.filter((rItems) => rItems?.title !== "" || rItems?.link !== "") || []
                                    const concatDataResourceLink = filteredResourceList.map((items) => `${items?.title}~${items?.link}`).join("|") || ""
                                    course['resource_list'] = concatDataResourceLink;
                                    const filteredExternalUrls = course?.externalUrls.filter((rItems) => rItems?.title !== "" || rItems?.link !== "");
                                    const concatDataExternalUrls = filteredExternalUrls.map((items) => `${items?.title}~${items?.link}`).join("|") || ""
                                    course['external_urls_videos'] = concatDataExternalUrls
                                    const concatExternalResources = course?.externalResources?.map((items) => `${items?.fileName}~${items?.fileUrl}`).join("|") || ""
                                    course['external_resources'] = concatExternalResources;
                                    course['section_id'] = createdSections?.id;
                                    const createdCourseSubSections = await courseUploads.create(course);
                                })
                            }
                        }
                    })

                }
                return res.status(200).send(responsesCommon.formatSuccessMessage('Course uploads successfully!', 400, null));
            }

        }
    } catch (error) {
        console.error(error);
        return res.status(400).send(responsesCommon.formatErrorMessage(error.message, 400, null));
    }

}

async function updateCourseContent(req, res) {
    try {
        const { uuid } = req.body;
        if (!!uuid) {
            const updatedCourseContent = await courseContent.update(req.body, {
                where: {
                    uuid: uuid
                }
            })
            if (!!updatedCourseContent[0]) {
                return res.status(200).send(responsesCommon.formatSuccessMessage('Course updated successfully!', 200, null));
            }
            return res.status(400).send(responsesCommon.formatSuccessMessage('This course is does not exist', 400, null));
        } else {
            delete req.body.id;
            req.body['uuid'] = uuidv4();
            const createdNewCourseId = await courseContent.create(req.body);
            if (!!createdNewCourseId) {
                return res.status(200).send(responsesCommon.formatSuccessMessage('New course is created', 200, null));
            }
            return res.status(400).send(responsesCommon.formatSuccessMessage('Failed to create course!', 400, null));
        }
    } catch (error) {
        console.error(error);
        return res.status(400).send(responsesCommon.formatErrorMessage(error.message, 400, null));

    }

}

async function updateCourseSection(req, res) {
    try {
        const { course_id, uuid } = req.body;
        if (!!uuid) {
            //update
            const updatedSection = await CourseSections.update(req.body, {
                where: {
                    uuid: uuid,
                }
            })
            if (!!updatedSection[0]) {
                return res.status(200).send(responsesCommon.formatSuccessMessage('Sections updated successfully!', 200, null));
            }
        } else {
            //create
            req.body['uuid'] = uuidv4();
            const updatedSection = await CourseSections.create(req.body);
            if (!!updatedSection) {
                return res.status(200).send(responsesCommon.formatSuccessMessage('Sections created successfully!', 200, null));
            } else {
                return res.status(400).send(responsesCommon.formatErrorMessage("Something went wrong!", 400, null));
            }
        }
    } catch (error) {
        console.error(error);
        return res.status(400).send(responsesCommon.formatErrorMessage(error.message, 400, null));
    }
}

async function updateCourseList(req, res) {
    try {
        const { uuid, section_id } = req.body;
        if (!!uuid) {
            //update
            const createdCourseList = await courseUploads.update(req.body, {
                where: {
                    uuid: uuid
                }
            })
            if (!!createdCourseList[0]) {
                return res.status(200).send(responsesCommon.formatSuccessMessage('Course list updated successfully!', 200, null));
            }
        } else {
            //create
            req.body['uuid'] = uuidv4();
            const createdCourseList = await courseUploads.create(req.body);
            if (!!createdCourseList) {
                return res.status(200).send(responsesCommon.formatSuccessMessage('Course list is created', 200, null));
            }
            return res.status(400).send(responsesCommon.formatSuccessMessage('Failed to create course list!', 400, null));
        }
    } catch (error) {
        console.error(error);
        return res.status(400).send(responsesCommon.formatErrorMessage(error.message, 400, null));
    }
}

async function fetAllCourseListByKeys(req, res) {
    try {
        const { external, user_id, course_id, uuid, id } = req.body;

        let whereClause = {
            status: '1',
        }

        if (external === "1") {
            whereClause = { id: id?.split("|") }
        } else {
            if (!!uuid) {
                whereClause = { uuid: uuid }
            } else if (!!user_id) {
                whereClause = { user_id: user_id }

            }

        }
        courseContent.findAll({
            where: { ...whereClause, status: "1" }
        }).then(async (course) => {
            if (course.length > 0) {
                const courseIds = course.map((items) => items?.id)
                const userIds = [...new Set(course.map((items) => items?.user_id))];
                const reviewedManageData = await reviewManage.findAll({
                    where: {
                        course_id: courseIds,
                        status: "1"
                    }
                })
                const uploadByUsers = await businessusers.findAll({
                    where: {
                        id: userIds,
                        is_active: 1
                    },
                    attributes: ['id', 'first_name', 'last_name', 'roles', 'bus_email', 'profile_url']
                })

                const sections = await CourseSections.findAll({
                    where: {
                        status: '1',
                        course_id: courseIds
                    }
                })

                const reviewList = await couresReviews.findAll({
                    where: {
                        status: '1',
                        course_id: courseIds
                    }
                })
                let certificate = []
                if (!!user_id) {
                    const courseCertificates = await userCertificateTable.findAll({
                        where: {
                            user_id,
                            course_id: courseIds,
                            type: "certificate"
                        }
                    })
                    certificate = courseCertificates;

                }
                //fetch courseCertificateDetails
                const videoProgressArray = [];
                const videoTotalLength = [];
                const sectionsIds = sections.map((items) => items?.id)
                const subSectionsListCourse = await courseUploads.findAll({ where: { section_id: sectionsIds, status: "1" } })
                const courseUploadIds = subSectionsListCourse.map((items) => items?.id)
                let reqDataForProgress = {
                    upload_id: courseUploadIds,
                    status: "1"
                }
                if (!!user_id) {
                    reqDataForProgress = {
                        upload_id: courseUploadIds,
                        status: "1", user_id:
                            user_id
                    }
                }
                const userProgressData = await userCourseProgress.findAll({ where: reqDataForProgress })
                const updatedSubSectionData = subSectionsListCourse.map((items) => {
                    const _items = items?.dataValues;

                    const progressObject = userProgressData.find((fItems) => fItems?.upload_id == _items?.id);
                    videoProgressArray.push(!!progressObject?.video_progress ? progressObject?.video_progress : "0")
                    videoTotalLength.push(_items?.video_length);

                    const externalResourseSplit = _items?.external_resources?.split("|");
                    const resourceListSplit = _items?.resources_list?.split("|");
                    const exterUrlsSplit = _items?.external_urls_videos?.split("|");
                    const externalResources = externalResourseSplit.map((resourceItems) => {
                        const [fileName, fileUrl] = resourceItems?.split("~");
                        return { fileName, fileUrl }
                    })
                    const resourceList = resourceListSplit.map((resourceItems) => {
                        const [title, link = ""] = resourceItems?.split("~");
                        return { title, link }
                    })
                    const externalUrls = exterUrlsSplit.map((resourceItems) => {
                        const [title, link = ""] = resourceItems?.split("~");
                        return {
                            title, link
                        }
                    })

                    return {
                        ..._items,
                        progressData: !!progressObject ? progressObject : { video_progress: "0", is_completed: "0" },
                        externalResources: !!_items?.external_resources ? externalResources : [],
                        resourceList: !!resourceList ? resourceList : [],
                        externalUrls: !!externalUrls ? externalUrls : [],
                    }
                })
                const updateSectionList = sections.map((items) => {
                    const sectionItems = items.dataValues;

                    return {
                        ...sectionItems,
                        courseSubSections: updatedSubSectionData?.filter((items) => items?.section_id == sectionItems?.id)
                    }
                })

                //calculating video progress
                let videoProgress = videoProgressArray.map(Number);
                let videoProgressSum = videoProgress.reduce((acc, num) => acc + num, 0);

                //calculating total video progress 
                let totalVideoProgress = videoTotalLength.map(Number);
                let totalVideoProgressSum = totalVideoProgress.reduce((acc, num) => acc + num, 0);


                const coursesList = course.map((items) => {
                    const courseItems = items?.dataValues;
                    return {
                        ...courseItems,
                        reviews: reviewList.filter((items) => items?.course_id == courseItems?.id),
                        isReviewedByUser: reviewedManageData.map((items) => items?.user_id),
                        userDetails: uploadByUsers.find((userItems) => userItems?.id == courseItems?.user_id) || {},
                        sections: updateSectionList.filter((items) => items?.course_id == courseItems?.id),
                        allVideosProgress: videoProgressSum.toFixed(2),
                        videoTotalLength: totalVideoProgressSum.toFixed(2),
                        isCourseCompleted: "",
                        certificate: certificate?.find((items) => items?.course_id == courseItems?.id) || null
                    }
                })
                return res.status(200).send(responsesCommon.formatSuccessMessage('Data fetched successfully!', coursesList, 200));
            }
            return res.status(200).send(responsesCommon.formatSuccessMessage('Data fetched successfully!', [], 200));
        })
    } catch (error) {
        console.error(error);
        return res.status(400).send(responsesCommon.formatErrorMessage(error.message, 400, null));
    }
}

async function fetchCourseSection(req, res) {
    try {
        const { uuid, course_id } = req.body;
        if (!!uuid) {
            const fetchSectionDetails = await CourseSections.findAll({
                where: {
                    status: '1',
                    uuid: uuid
                }
            })
            const sectionIds = fetchSectionDetails.map((items) => items?.id)

            //fetch sub sections
            const subSectionsListCourse = await courseUploads.findAll({
                where: {
                    section_id: sectionIds,
                    status: "1"
                }
            })
            const updatedSections = fetchSectionDetails.map((section) => {
                const sectionItems = section.dataValues;
                return {
                    ...sectionItems,
                    courseSubSections: subSectionsListCourse?.filter((items) => items?.section_id == section?.id)
                }

            })
            return res.status(200).send(responsesCommon.formatSuccessMessage('Data fetched successfully!', updatedSections, 200));
        }
        if (!!course_id) {
            const fetchSectionDetails = await CourseSections.findAll({
                where: {
                    status: '1',
                    course_id: course_id
                }
            })
            const sectionIds = fetchSectionDetails.map((items) => items?.id)
            //fetch sub sections
            const subSectionsListCourse = await courseUploads.findAll({
                where: {
                    section_id: sectionIds,
                    status: "1"
                }
            })
            const updatedSections = fetchSectionDetails.map((section) => {
                const sectionItems = section.dataValues;
                return {
                    ...sectionItems,
                    courseSubSections: subSectionsListCourse?.filter((items) => items?.section_id == section?.id)
                }
            })
            return res.status(200).send(responsesCommon.formatSuccessMessage('Data fetched successfully!', updatedSections, 200));
        }
        return res.status(400).send(responsesCommon.formatErrorMessage("Something went wrong!", 400, null));
    } catch (error) {
        console.error(error);
        return res.status(400).send(responsesCommon.formatErrorMessage(error.message, 400, null));

    }
}

async function fetchCourseList(req, res) {
    try {
        const { uuid, section_id } = req.body;
        const subSectionsListCourse = await courseUploads.findAll({
            where: {
                status: "1",
                uuid: uuid.split("|")
            }
        })
        return res.status(200).send(responsesCommon.formatSuccessMessage('Data fetched successfully!', subSectionsListCourse, 200));
    } catch (error) {
        console.error(error);
        return res.status(400).send(responsesCommon.formatErrorMessage(error.message, 400, null));

    }
}


async function searchCourses(req, res) {
    try {
        const { searchText, location } = req.body;
        const searchedCourses = await courseContent.findAll({
            where: {
                status: "1",
                [Op.or]: [
                    {
                        course_title: {
                            [Op.like]: `%${searchText}%`
                        }
                    },
                    {
                        course_description: {
                            [Op.like]: `%${searchText}%`
                        }
                    }
                ]
            }
        },
        )
        const userIds = searchedCourses.map((items) => items?.user_id)
        const users = await businessusers.findAll({
            where: {
                id: userIds
            },
            attributes: ['id', 'uuid', 'first_name', 'last_name', 'roles', 'bus_email', 'profile_url']
        })
        const addedUserDetails = searchedCourses.map((items) => {
            const _items = items?.dataValues;
            return {
                ..._items,
                userDetails: users?.find((item) => item?.id == _items?.user_id) || {}
            }
        })
        return res.status(200).send(responsesCommon.formatSuccessMessage('Data fetched successfully!', addedUserDetails, 200));
    } catch (error) {
        console.error(error);
        return res.status(400).send(responsesCommon.formatErrorMessage(error.message, 400, null));

    }
}

async function fetchRelatedCourses(req, res) {
    try {
        const { related_ids } = req.body;
        const _relatedIds = related_ids?.split("|")
        req.body["id"] = related_ids || [];
        req.body['external'] = "1"
        delete req.body.related_ids
        fetAllCourseListByKeys(req, res);
    } catch (error) {
        console.error(error);
        return res.status(400).send(responsesCommon.formatErrorMessage(error.message, 400, null));

    }
}

async function uploadExternalResources(req, res) {
    try {
        const filesUrls = req.files.map((items) => {
            return {
                fileName: items?.originalname,
                fileUrl: `${process.env.APP_NODE_URL}/bo-images/${items?.filename}`
            }
        })
        res.json(filesUrls);


    } catch (error) {
        console.error(error);
    }

}

async function createReviewByUser(req, res) {
    try {
        req.body['uuid'] = uuidv4();
        const { user_id, course_id } = req.body;
        const createdReview = await couresReviews.create(req.body)
        if (createdReview) {
            await reviewManage.create({
                user_id, course_id, uuid: uuidv4(), review_id: createdReview?.id
            })
            return res.status(200).send(responsesCommon.formatSuccessMessage('Review submitted successfully!', null, 200));

        }
        return res.status(400).send(responsesCommon.formatSuccessMessage('Failed to create review!', null, 400));

    } catch (error) {
        console.error(error);
        return res.status(400).send(responsesCommon.formatErrorMessage(error.message, 400, null));

    }
}

async function updateReviewByLike(req, res) {
    try {
        const { uuid, status, course_id, user_id, review_id } = req.body;
        if (!!uuid) {
            const createdReview = await couresReviews.update(req.body, {
                where: {
                    uuid: uuid
                }
            })
            if (!!status) {
                await reviewManage.update({ status: "0" }, {
                    where: {
                        review_id: review_id
                    }
                })
            }

            if (createdReview[0] > 0) {
                return res.status(200).send(responsesCommon.formatSuccessMessage('Review updated successfully!', null, 200));

            }
        }
        return res.status(400).send(responsesCommon.formatSuccessMessage('Field uuid is required!', null, 400));

    } catch (error) {
        console.error(error);
        return res.status(400).send(responsesCommon.formatErrorMessage(error.message, 400, null));

    }
}

async function getReviews(req, res) {
    try {
        const { course_id, searchText, ratingCount } = req.body;
        if (!!course_id) {


            const where = {
                course_id: course_id,
                status: "1",
            }
            if (!!searchText) {
                where['comment'] = {
                    [Op.like]: `%${searchText}%`
                };
            }
            if (!!ratingCount) {
                where['stars'] = ratingCount;
            }
            const allReviews = await couresReviews.findAll(
                {
                    where,
                    order: [['id', 'DESC']]
                },
            )

            const userIds = [...new Set(allReviews.map((items) => items?.user_id))];
            const users = await businessusers.findAll({
                where: {
                    id: userIds
                },
                attributes: ['id', 'uuid', 'first_name', 'last_name', 'roles', 'bus_email', 'profile_url']
            })
            const addedUserDetails = allReviews.map((items) => {
                const _items = items?.dataValues;
                return {
                    ..._items,
                    userDetails: users?.find((item) => item?.id == _items?.user_id) || {}
                }
            })
            return res.status(200).send(responsesCommon.formatSuccessMessage('Review fetched successfully!', { data: addedUserDetails, count: addedUserDetails.length }, 200));
        }
        return res.status(400).send(responsesCommon.formatSuccessMessage('Field course_id is required!', null, 400));
    } catch (error) {
        console.error(error);
        return res.status(400).send(responsesCommon.formatErrorMessage(error.message, 400, null));
    }
}

async function bulkImportUsers(req, res) {
    try {
        const workbook = xlsx.readFile("tecdemy_users.xlsx");
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const users = xlsx.utils.sheet_to_json(sheet);
        const updatedUsers = users.map((items) => {
            return { ...items, uuid: uuidv4() }
        })
        const jsonString = JSON.stringify(users);
        const byteSize = Buffer.byteLength(jsonString, 'utf8');
        const mbSize = byteSize / (1024 * 1024); // convert bytes to MB
        const result = await businessusers.bulkCreate(updatedUsers);
        if (!!result) {
            return res.status(200).send(responsesCommon.formatSuccessMessage("Bulk users added!", 200, null));
        } else {
            return res.status(400).send(responsesCommon.formatErrorMessage("Failed to add bulk users!", 200, null));
        }

    } catch (error) {
        console.error(error);
        return res.status(400).send(responsesCommon.formatErrorMessage(error.message, 400, null));
    }
}

const getCourseProgress = (req, res) => {
    try {
        const { user_id } = req.body;
        //get purchased courses

    } catch (error) {
        console.error(error);
    }
}

const getFilesFromS3 = (req, res) => {
    try {
        const { query } = req;
        const { fileUrl } = query;
        const splitted = fileUrl.split("/");
        const fileName = splitted[splitted.length - 1]
        const preSignedURL = getPreSignedUrl(fileName, 'videos');
        if (!!preSignedURL) {
            return res.status(200).send(responsesCommon.formatSuccessMessage("URL generated successfully!", { preSignedURL }, 200, null));
        }
        return res.status(400).send(responsesCommon.formatErrorMessage("Failed to fetch file!", 200, null));

    } catch (error) {
        console.error(error);
    }
}


const deleteFilesFromS3 = async (req, res) => {
    try {
        const { fileUrl } = req.query;
        const isFileDelete = await deleteFileFromS3(fileUrl);
        if (!!isFileDelete) {
            return res.status(200).send(responsesCommon.formatSuccessMessage("File deleted successfully!",
                { fileUrl: fileUrl }, 200, null));
        }
        return res.status(400).send(responsesCommon.formatErrorMessage("Failed to delete file!",
            200, null));
    } catch (error) {
        console.error(error);
    }
}







module.exports = {
    uploadCourseFiles,
    uploadCourseThumbnail,
    uploadCourseFiles,
    uploadCourse,
    updateCourseContent,
    updateCourseSection,
    updateCourseList,
    fetAllCourseListByKeys,
    fetchCourseSection,
    fetchCourseList,
    searchCourses,
    fetchRelatedCourses,
    uploadExternalResources,
    createReviewByUser,
    updateReviewByLike,
    getReviews,
    bulkImportUsers,
    getCourseProgress,
    getFilesFromS3,
    deleteFilesFromS3
};
