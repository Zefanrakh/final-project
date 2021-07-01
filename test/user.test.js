const request = require("supertest");
const app = require("../app");
const { User, Customer } = require("../models");
const {sign} = require('../helpers/jwt')

let firstUserId;
let secondUserId;
let firstCustomerId;
let secondCustomerId;
let access_token;
let token;

beforeAll((done) => {
  const defaultData = {
    phoneNumber: 12345678,
    name: "The Name",
    address: "1st street, 3rd block",
  };

  User.create({
    username: "thefirstmostuniqueusername",
    password: "encryptedpassword",
    profilePicture:
      "https://cdn.pixabay.com/photo/2015/03/04/22/35/head-659652_960_720.png",
    role: "customer",
  })
    .then((user) => {
      token = sign ({id: user.id, username: user.username, role: user.role})
      firstUserId = user.id;
      return Customer.create({
        email: "theveryfirstuniquetesting@mail.com",
        ...defaultData,
        UserId: user.id,
      });
    })
    .then((customer) => {
      firstCustomerId = customer.id;
      return Customer.findOne({
        where: {
          id: customer.id,
        },
        include: {
          model: User,
          attributes: ["username", "role", "profilePicture"],
        },
      });
    })
    .then(() => {
      done();
    })
    .catch((err) => {
      done(err);
    });
});

afterAll((done) => {
  User.destroy({ truncate: { cascade: true } })
    .then((_) => {
      return Customer.destroy({ truncate: { cascade: true } });
    })
    .then((_) => {
      done();
    })
    .catch((err) => {
      done(err);
    });
});

describe("Check existing email", () => {
  it("Return null if the email doesn't exist", (done) => {
    request(app)
      .post("/user/checkexistemail")
      .send({
        email: "nottheveryfirstuniquetesting@mail.com",
      })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("user", null);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

});

describe("Check existing username", () => {
  
  it("Return a user object if the username exist", (done) => {
    request(app)
      .post("/user/checkexistusername")
      .send({
        username: "thefirstmostuniqueusername",
      })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("user", expect.any(Object));
        expect(res.body.user).toHaveProperty("id", expect.any(Number));
        expect(res.body.user).toHaveProperty("username", expect.any(String));
        expect(res.body.user).toHaveProperty("password", expect.any(String));
        expect(res.body.user).toHaveProperty(
          "profilePicture",
          expect.any(String)
        );
        expect(res.body.user).toHaveProperty("role", "customer");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it("Return null if the username doesn't exist", (done) => {
    request(app)
      .post("/user/checkexistusername")
<<<<<<< HEAD
      .send({
        username: "notthefirstmostuniqueusername",
      })
      .then((res) => {
=======
      .send({ username: "notthefirstmostuniqueusername" })
      .end((err, res)=>{
        if(err) return done(err)
>>>>>>> development
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("user", null);
        done();
      })
  });
});

describe("Register User", () => {
  it("should return access token and user", (done) => {
    request(app)
      .post("/user/register")
      .send({
        username: "themostuniqueusername",
        password: "encryptedpassword",
        profilePicture:
          "https://cdn.pixabay.com/photo/2015/03/04/22/35/head-659652_960_720.png",
        role: "customer",
        email: "themostuniquemail@mail.com",
        phoneNumber: 12345678,
        name: "Any Sue",
        address: "1st street, 3rd block",
      })
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("access_token", expect.any(String));
        expect(res.body).toHaveProperty("user", expect.any(Object));
        expect(res.body.user).toHaveProperty("id", expect.any(Number));
        expect(res.body.user).toHaveProperty(
          "username",
          expect.any(String)
        );
        expect(res.body.user).toHaveProperty(
          "password",
          expect.any(String)
        );
        expect(res.body.user).toHaveProperty(
          "profilePicture",
          expect.any(String)
        );
        expect(res.body.user).toHaveProperty("role", expect.any(String));
        const tempArrayRole = ["customer", "admin"];
        expect(tempArrayRole).toEqual(
          expect.arrayContaining([res.body.user.role])
        );
        done();
      });
  });
});

describe("Login User", () => {
  it("should return an access token and a user object if login success", (done) => {
    request(app)
      .post("/user/login")
      .send({
        username: "thefirstmostuniqueusername",
        password: "encryptedpassword"
      })
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("access_token", expect.any(String));
        access_token = res.body.access_token;
        expect(res.body).toHaveProperty("user", expect.any(Object));
        expect(res.body.user).toHaveProperty("id", expect.any(Number));
        expect(res.body.user).toHaveProperty("username", expect.any(String));
        expect(res.body.user).toHaveProperty("password", expect.any(String));
        expect(res.body.user).toHaveProperty(
          "profilePicture",
          expect.any(String)
        );
        const tempArrayRole = ["customer", "admin"];
        expect(tempArrayRole).toEqual(
          expect.arrayContaining([res.body.user.role])
        );
        done()
      });
  });

  it("should get an error message if the username doesn't exist", (done) => {
    request(app)
      .post("/user/login")
      .send({
        username: "thesecondmostuniqueusername",
        password: "encryptedpassword",
      })
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty(
          "message",
          "Wrong username or password"
        );
        done();
      });
  });

  it("should get an error message if the password doesn't match", (done) => {
    request(app)
      .post("/user/login")
      .send({
        username: "thefirstmostuniqueusername",
        password: "notencryptedpassword",
      })
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty(
          "message",
          "Wrong username or password"
        );
        done();
      });
  });
});

describe("Get user data", () => {
  it("should return a user object", (done) => {
    request(app)
      .post("/user/getdata")
      .set('access_token', token)
      .send({
        username: "thefirstmostuniqueusername",
      })
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("user", expect.any(Object));
        expect(res.body.user).toHaveProperty("id", expect.any(Number));
        expect(res.body.user).toHaveProperty("username", expect.any(String));
        expect(res.body.user).toHaveProperty("password", expect.any(String));
        expect(res.body.user).toHaveProperty(
          "profilePicture",
          expect.any(String)
        );
        const tempArrayRole = ["customer", "admin"];
        expect(tempArrayRole).toEqual(
          expect.arrayContaining([res.body.user.role])
        );
        done();
      });
  });
});
