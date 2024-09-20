using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using OpenCv.DAL;  // Update namespace to match your project structure
using OpenCv.Helper;
using OpenCv.Model;
using System;
using System.Collections.Generic;
using System.Linq;

namespace OpenCv.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class SignController : ControllerBase {
        private readonly UserDal _userDal;
        private readonly JWTTokenManagger _jwtTokenManager;
        private readonly ILogger<SignController> _logger;

        public SignController(UserDal userDal, JWTTokenManagger jwtTokenManager, ILogger<SignController> logger) {
            _userDal = userDal;
            _jwtTokenManager = jwtTokenManager;
            _logger = logger;
        }

        [HttpGet("test")]
        public IActionResult Test() {
            var response = new { message = "Test successful" };
            return Ok(response);
        }


        [HttpPost("signUp")]
        public IActionResult SignUp([FromBody] SignUp signUpModel) {
            if (signUpModel == null) {
                return BadRequest("SignUpModel is null.");
            }

            if (signUpModel.Password != signUpModel.ConfirmPassword) {
                return BadRequest("Passwords do not match.");
            }

            try {
                _userDal.ConnectionOpen();

                if (_userDal.IsUserExist(signUpModel.Email)) {
                    return BadRequest("User already exists.");
                }

                _userDal.NewUser(signUpModel);
                return Ok("Sign up successful.");
            }
            catch (Exception ex) {
                _logger.LogError(ex, "An error occurred during sign-up.");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
            finally {
                _userDal.ConnectionClose();
            }
        }

        [HttpPost("signIn")]
        public IActionResult SignIn([FromBody] SignIn signInModel) {
            Console.WriteLine("A request arrived.");
            if (signInModel == null) {
                return BadRequest("SignIn model is null.");
            }

            var validationResults = new List<ValidationResult>();
            var context = new ValidationContext(signInModel);
            if (!Validator.TryValidateObject(signInModel, context, validationResults, true)) {
                return BadRequest(new { Errors = validationResults.Select(vr => vr.ErrorMessage) });
            }

            if (string.IsNullOrEmpty(signInModel.Email) || string.IsNullOrEmpty(signInModel.Password)) {
                return BadRequest("Email and password are required.");
            }

            try {
                _userDal.ConnectionOpen();

                bool isAuthenticated = _userDal.UserAuth(signInModel.Email, signInModel.Password);

                if (isAuthenticated) {
                    var token = _jwtTokenManager.GenerateToken(signInModel.Email);
                    return Ok(new { Token = token });
                }
                else {
                    return Unauthorized("Invalid email or password.");
                }
            }
            catch (Exception ex) {
                _logger.LogError(ex, "An error occurred during sign-in. Email: {Email}", signInModel?.Email);
                return StatusCode(500, "Internal server error. Please try again later.");
            }
            finally {
                _userDal.ConnectionClose();
            }
        }
    }
}