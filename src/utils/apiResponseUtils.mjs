

  /**
   * Kirim response sukses
   * @param {object} res - Express response object
   * @param {object} options - { statusCode, message, data }
   */
  export function successResponse(res, { statusCode = 200, message = 'Success', data } = {}) {
    const response = {
      error: false,
      message
    };

    if (data !== undefined) {
      response.data = data;
    }

    return res.status(statusCode).json(response);
  }

  
  /**
   * Kirim response error
   * @param {object} res - Express response object
   * @param {object} options - { statusCode, message, errors }
   */
  export function errorResponse(res, { statusCode = 500, message = 'Internal Server Error',} = {}) {
    return res.status(statusCode).json({
      error: true,
      message,
    });
  }
  