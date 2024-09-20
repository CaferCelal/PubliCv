using System;
using System.Security.Cryptography;
using System.Text;

namespace OpenCv.Helper
{
    public class Helper
    {
        private static readonly char[] _saltChars = 
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".ToCharArray();

        // Generates a random salt of specified length
        public string GenerateSalt(int length = 6)
        {
            if (length <= 0)
            {
                throw new ArgumentException("Length must be greater than zero.", nameof(length));
            }

            var salt = new StringBuilder(length);
            using (var rng = new RNGCryptoServiceProvider())
            {
                byte[] randomBytes = new byte[length];
                rng.GetBytes(randomBytes);

                for (int i = 0; i < length; i++)
                {
                    salt.Append(_saltChars[randomBytes[i] % _saltChars.Length]);
                }
            }

            return salt.ToString();
        }

        // Hashes the given text using SHA-256 and returns the hash as a hexadecimal string
        public string ComputeSha256Hash(string text)
        {
            if (string.IsNullOrEmpty(text))
            {
                throw new ArgumentException("Text must not be null or empty.", nameof(text));
            }

            using (var sha256 = SHA256.Create())
            {
                byte[] bytes = Encoding.UTF8.GetBytes(text);
                byte[] hashBytes = sha256.ComputeHash(bytes);

                var hash = new StringBuilder(hashBytes.Length * 2);
                foreach (byte b in hashBytes)
                {
                    hash.AppendFormat("{0:x2}", b);
                }

                return hash.ToString();
            }
        }
    }
}