const Businessusers = require("../../models").businessusers;
const responsesCommon = require("../../common/response.common");

/**
 * @description
 * This function is used to fetch all active business users.
 * 
 * @param {object} req 
 * @param {object} res
 * @returns {Promise<void>}
 */
async function getAllUsers(req, res) {
  try {
    const users = await Businessusers.findAll({
        attributes: { exclude: ['password'] },
      // where: { is_active: true }, // Fetch only active users
    });

    if (users.length === 0) {
      return res
        .status(404)
        .send(
          responsesCommon.formatErrorMessage("No users found.", 404, [])
        );
    }

    return res
      .status(200)
      .send(
        responsesCommon.formatSuccessMessage(
          "Users fetched successfully.",
          users,
          null,
          users.length,
          ""
        )
      );
  } catch (error) {
    console.error("Error fetching users:", error);

    return res
      .status(500)
      .send(
        responsesCommon.formatErrorMessage("Error fetching users.", 500, null)
      );
  }
}

module.exports = getAllUsers;




// const Businessusers = require("../../models").businessusers;
// const responsesCommon = require("../../common/response.common");


// async function getAllUsers(req, res) {
//   try {
//     const users = await Businessusers.findAll({
//       attributes: { exclude: ["password"] },
//     });

//     if (users.length === 0) {
//       return res
//         .status(404)
//         .send(
//           responsesCommon.formatErrorMessage("No users found.", 404, [])
//         );
//     }

//     return res
//       .status(200)
//       .send(
//         responsesCommon.formatSuccessMessage(
//           "Users fetched successfully.",
//           users,
//           null,
//           users.length,
//           ""
//         )
//       );
//   } catch (error) {
//     console.error("Error fetching users:", error);

//     return res
//       .status(500)
//       .send(
//         responsesCommon.formatErrorMessage("Error fetching users.", 500, null)
//       );
//   }
// }


// // async function updateUser(req, res) {
// //   const { id } = req.params;
// //   const updatedData = req.body;
// //  console.log("req,body", updatedData)
// //   try {
// //     const [affectedRows] = await Businessusers.update(updatedData, {
// //       where: { id },
// //     });

// //     if (affectedRows === 0) {
// //       return res
// //         .status(404)
// //         .send(
// //           responsesCommon.formatErrorMessage("User not found.", 404, null)
// //         );
// //     }

// //     return res
// //       .status(200)
// //       .send(
// //         responsesCommon.formatSuccessMessage(
// //           "User updated successfully.",
// //           null,
// //           null,
// //           affectedRows,
// //           ""
// //         )
// //       );
// //   } catch (error) {
// //     console.error("Error updating user:", error);

// //     return res
// //       .status(500)
// //       .send(
// //         responsesCommon.formatErrorMessage("Error updating user.", 500, null)
// //       );
// //   }
// // }

// module.exports = { getAllUsers, updateUser };
