const axios = require('axios');
const responsesCommon = require('../../common/response.common');

// Function to generate an OAuth Access Token
const generateAccessToken = async () => {
  try {
    const {
      ZOOM_OAUTH_ENDPOINT,
      ZOOM_ACCOUNT_ID,
      ZOOM_API_KEY,
      ZOOM_API_SECRET,
    } = process.env;

    if (!ZOOM_ACCOUNT_ID || !ZOOM_API_KEY || !ZOOM_API_SECRET) {
      throw new Error(
        'Missing required environment variables: ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET'
      );
    }

    const params = new URLSearchParams({
      grant_type: 'account_credentials',
      account_id: ZOOM_ACCOUNT_ID,
    });

    const requestHeaders = {
      Authorization: `Basic ${Buffer.from(
        `${ZOOM_API_KEY}:${ZOOM_API_SECRET}`
      ).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    const response = await axios.post(ZOOM_OAUTH_ENDPOINT, params.toString(), {
      headers: requestHeaders,
    });

    const { access_token, expires_in } = response.data;

    // console.log('Successfully retrieved Access Token:', access_token);
    return { access_token, expires_in, error: null };
  } catch (error) {
    console.error(
      'Error retrieving Access Token:',
      error.response?.data || error.message
    );
    return { access_token: null, expires_in: null, error };
  }
};
// const generateAccessToken = async () => {
//   const tokenUrl = 'https://zoom.us/oauth/token?grant_type=client_credentials';
//   const clientId = process.env.ZOOM_API_KEY;
//   const clientSecret = process.env.ZOOM_API_SECRET;

//   try {
//     const response = await axios.post(
//       tokenUrl,
//       {},
//       {
//         headers: {
//           Authorization: `Basic ${Buffer.from(
//             `${clientId}:${clientSecret}`
//           ).toString('base64')}`,
//         },
//       }
//     );
//     console.log('Access Token:', response.data.access_token);
//     return response.data.access_token;
//   } catch (error) {
//     console.error(
//       'Error generating Access Token:',
//       error.response?.data || error.message
//     );
//     throw new Error('Failed to generate Access Token');
//   }
// };
// const getUserId = async (accessToken) => {
//   try {
//     const response = await axios.get(`${process.env.ZOOM_BASE_URL}/users`, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         'Content-Type': 'application/json',
//       },
//     });
//     // Return the email or ID of the first user in the account
//     return response.data.users[0].id; // Adjust this if you have multiple users
//   } catch (error) {
//     console.error(
//       'Error fetching user ID:',
//       error.response?.data || error.message
//     );
//     throw new Error('Failed to fetch user ID');
//   }
// };

module.exports = {
  fetchMeetingList: async (req, res) => {
    try {
      const { access_token } = await generateAccessToken();

      const userId = 'me';

      const zoomAPI = `${process.env.ZOOM_BASE_URL}/users/${userId}/meetings`;
      const queryParams = new URLSearchParams({ type: 'all' }).toString();

      const response = await axios.get(`${zoomAPI}?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
      });

      //   return res.status(200).json(response.data);
      return res
        .status(200)
        .send(
          responsesCommon.formatSuccessMessage(
            'Data fetched successfully!',
            response.data,
            200
          )
        );
    } catch (error) {
      console.error(
        'Error fetching meeting list:',
        error.response?.data || error.message
      );
      return res
        .status(400)
        .send(responsesCommon.formatErrorMessage(error?.message, 400, null));
    }
  },

  createMeeting: async (req, res) => {
    try {
      const { access_token } = await generateAccessToken();
      const config = {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
      };

      const meetingDetails = {
        topic: req.body.topic || 'Test Meeting',
        type: 2, // Scheduled meeting
        start_time: req.body.start_time,
        duration: req.body.duration || 30,
        timezone: req.body.timezone || 'UTC',
        settings: {
          host_video: true,
          participant_video: true,
        },
      };

      const response = await axios.post(
        `${process.env.ZOOM_BASE_URL}/users/me/meetings`,
        meetingDetails,
        config
      );

      //   return res.json(response.data);
      return res
        .status(200)
        .send(
          responsesCommon.formatSuccessMessage(
            'Data fetched successfully!',
            response.data,
            200
          )
        );
    } catch (error) {
      console.error(
        'Error creating meeting:',
        error.response?.data || error.message
      );
      return res
        .status(400)
        .send(responsesCommon.formatErrorMessage(error?.message, 400, null));
    }
  },
};
