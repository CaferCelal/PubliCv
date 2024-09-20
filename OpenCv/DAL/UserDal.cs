using System;
using System.Data;
using System.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using OpenCv.Model;
using OpenCv.Helper;

namespace OpenCv.DAL
{
    public class UserDal
    {
        private readonly string _connectionString;
        private SqlConnection _sqlConnection;
        private Helper.Helper _helper;

        public UserDal(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
            _sqlConnection = new SqlConnection(_connectionString);
            _helper = new Helper.Helper();
        }

        public void ConnectionOpen()
        {
            if (_sqlConnection.State == ConnectionState.Closed)
            {
                _sqlConnection.Open();
            }
            else if (_sqlConnection.State == ConnectionState.Broken)
            {
                _sqlConnection.Close();
                _sqlConnection.Open();
            }
        }

        public void ConnectionClose()
        {
            if (_sqlConnection.State == ConnectionState.Open || _sqlConnection.State == ConnectionState.Broken)
            {
                _sqlConnection.Close();
            }
        }

        public bool IsUserExist(string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                throw new ArgumentException("Email must not be null or empty.", nameof(email));
            }

            if (_sqlConnection.State != ConnectionState.Open)
            {
                throw new InvalidOperationException("The provided connection must be open.");
            }

            try
            {
                using (var command = new SqlCommand("SELECT COUNT(1) FROM Users WHERE Email = @Email", _sqlConnection))
                {
                    command.Parameters.AddWithValue("@Email", email);

                    int count = (int)command.ExecuteScalar();
                    return count > 0;
                }
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An error occurred while checking if the user exists.", ex);
            }
        }

        public void NewUser(SignUp model)
        {
            if (model == null)
            {
                throw new ArgumentNullException(nameof(model));
            }

            if (string.IsNullOrEmpty(model.Email) || string.IsNullOrEmpty(model.Password))
            {
                throw new ArgumentException("Email and Password must not be null or empty.");
            }

            if (_sqlConnection.State != ConnectionState.Open)
            {
                throw new InvalidOperationException("The provided connection must be open.");
            }

            try
            {
                // Generate salt and hash the password
                string salt = _helper.GenerateSalt();
                string saltedPassword = model.Password + salt;
                string hashedPassword = _helper.ComputeSha256Hash(saltedPassword);

                // Insert user into the database
                using (var command = new SqlCommand(
                    "INSERT INTO Users (Name, Surname, Email, Password, Salt, Refactor_Code, Cv_Path) " +
                    "VALUES (@Name, @Surname, @Email, @Password, @Salt, @Refactor_Code, @Cv_Path)", _sqlConnection))
                {
                    command.Parameters.AddWithValue("@Name", model.Name);
                    command.Parameters.AddWithValue("@Surname", model.Surname);
                    command.Parameters.AddWithValue("@Email", model.Email);
                    command.Parameters.AddWithValue("@Password", hashedPassword);
                    command.Parameters.AddWithValue("@Salt", salt);
                    command.Parameters.AddWithValue("@Refactor_Code", DBNull.Value); // Or assign a value if needed
                    command.Parameters.AddWithValue("@Cv_Path", DBNull.Value); // Or assign a value if needed

                    command.ExecuteNonQuery();
                }
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An error occurred while adding the new user.", ex);
            }
        }
        
        public bool UserAuth(string email, string password)
        {
            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
            {
                throw new ArgumentException("Email and Password must not be null or empty.");
            }

            if (_sqlConnection.State != ConnectionState.Open)
            {
                throw new InvalidOperationException("The provided connection must be open.");
            }

            try
            {
                // First, retrieve the user's salt and hashed password from the database
                string storedSalt;
                string storedHashedPassword;

                using (var command = new SqlCommand("SELECT Salt, Password FROM Users WHERE Email = @Email", _sqlConnection))
                {
                    command.Parameters.AddWithValue("@Email", email);

                    using (var reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            storedSalt = reader["Salt"].ToString();
                            storedHashedPassword = reader["Password"].ToString();
                        }
                        else
                        {
                            // User not found
                            return false;
                        }
                    }
                }

                // Hash the provided password with the retrieved salt
                string saltedPassword = password + storedSalt;
                string hashedPassword = _helper.ComputeSha256Hash(saltedPassword);

                // Compare the hashed password with the one stored in the database
                return hashedPassword.Equals(storedHashedPassword);
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An error occurred while authenticating the user.", ex);
            }
        }
    }
}
