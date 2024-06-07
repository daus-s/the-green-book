const { validEmail, validUsername, alpha } = require("../functions/isEmail");

describe("Validation Functions", () => {
    describe("validEmail", () => {
        it("should return true for valid email addresses", () => {
            expect(validEmail("test@example.com")).toBe(true);
            expect(validEmail("user.name+tag+sorting@example.com")).toBe(true);
            expect(validEmail("user.name@example.co.uk")).toBe(true);
        });

        it("should return false for invalid email addresses", () => {
            expect(validEmail("plainaddress")).toBe(false);
            expect(validEmail("@missingusername.com")).toBe(false);
            expect(validEmail("username@.com")).toBe(false);
        });
    });

    describe("validUsername", () => {
        it("should return true for valid usernames", () => {
            expect(validUsername("username123")).toBe(true);
            expect(validUsername("UserName")).toBe(true);
        });

        it("should return false for invalid usernames", () => {
            expect(validUsername("user name")).toBe(false);
            expect(validUsername("user@name")).toBe(false);
            expect(validUsername("username!")).toBe(false);
        });
    });

    describe("alpha", () => {
        it("should return true for strings with only alphabetic characters", () => {
            expect(alpha("abcDEF")).toBe(true);
            expect(alpha("Hello")).toBe(true);
        });

        it("should return false for strings with non-alphabetic characters", () => {
            expect(alpha("abc123")).toBe(false);
            expect(alpha("abc!")).toBe(false);
            expect(alpha("123")).toBe(false);
        });
    });
});
