import { faker } from "@faker-js/faker";

const apiUrl = Cypress.config("apiUrl");

const article = {
  title: `${faker.random.word()} ${faker.random.numeric(5)}`,
  description: faker.lorem.paragraph(),
  body: faker.random.word(),
};

const generateNum = (num) => Math.floor(Math.random() * num);
console.log(generateNum(99999));

describe("API methods", () => {
  before(() => cy.generateUserCreds());

  after(() => {
    cy.cleareFixtureFile("userRequestBody.json");
    cy.cleareFixtureFile("userResponse.json");
  });

  it("Create user", () => {
    cy.readFixtureFile("userRequestBody.json").then((user) => {
      cy.request({
        method: "POST",
        url: apiUrl + "/users",
        body: { user },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body?.user.username).to.eq(user.username);
        cy.writeUserResponse(response.body.user);
      });
    });
  });

  it("Get all tags from API and assert with tags array", () => {
    // authorization is not required
    const tags = ["implementations", "welcome", "introduction", "codebaseShow"];
    cy.request("GET", apiUrl + "/tags").then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.tags).to.be.a("array");
      expect(response.body.tags).to.deep.eq(tags);
    });
  });

  it("Create article and assert response", () => {
    cy.readFixtureFile("userResponse.json").then((user) => {
      const { token, username } = user;
      cy.request({
        method: "POST",
        url: apiUrl + "/articles",
        headers: {
          Authorization: `Token ${token}`,
        },
        body: { article },
      }).then((response) => {
        const { article: articleBody } = response.body;
        expect(response.status).to.eq(200);
        expect(response.body).to.have.key("article");
        expect(articleBody.author?.username).to.eq(username);
        expect(articleBody.body).to.be.a("string");
        expect(articleBody.body).to.eq(article.body);
        expect(articleBody.title).to.eq(article.title);
        expect(articleBody.description).to.eq(article.description);
        expect(articleBody.favorited).to.eq(false);
        expect(articleBody.createdAt).to.be.a("string");
      });
    });
  });

  it("Get all articles and check new created article from previous step", () => {
    cy.readFixtureFile("userResponse.json").then((user) => {
      const { token } = user;
      cy.request({
        method: "GET",
        url: apiUrl + "/articles?limit=10&offset=0",
        headers: {
          Authorization: `Token ${token}`,
        },
      }).then((response) => {
        const { articles } = response.body;
        expect(response.status).to.eq(200);
        const createdArticleIsExist = articles.some((respArticle) => {
          return (
            respArticle.body === article.body &&
            respArticle.title === article.title &&
            respArticle.description === article.description
          );
        });
        expect(createdArticleIsExist).true;
      });
    });
  });

  it("Find from articles array created in step 2 article, delete it and assert new articles array", () => {
    cy.readFixtureFile("userResponse.json").then((user) => {
      const { token } = user;
      return cy
        .request({
          method: "GET",
          url: apiUrl + "/articles?limit=10&offset=0",
          headers: {
            Authorization: `Token ${token}`,
          },
        })
        .then((response) => {
          const targetArticleForDelete = response.body.articles.find(
            (respArticle) =>
              respArticle.body === article.body &&
              respArticle.title === article.title &&
              respArticle.description === article.description
          );

          const { slug } = targetArticleForDelete;
          cy.request({
            method: "DELETE",
            url: apiUrl + `/articles/${slug}`,
            headers: {
              Authorization: `Token ${token}`,
            },
          }).then((response) => {
            expect(response.status).to.eq(204);
            expect(response.body).to.be.empty;
          });

          cy.request({
            method: "GET",
            url: apiUrl + "/articles",
            headers: {
              Authorization: `Token ${token}`,
            },
          }).then(({ body }) => {
            expect(body.articlesCount).to.eq(response.body.articlesCount - 1);
          });
        });
    });
  });
});

// function factorial(n) {
//   if (n == 0 || n == 1) {
//     return 1;
//   } else {
//     return n * factorial(n - 1);
//   }
// }
// let n = 4;
// console.log(factorial(n));

// const isPrime = (num) => {
//   for (let i = 2, s = Math.sqrt(num); i <= s; i++)
//     if (num % i === 0) return false;
//   return num > 1;
// };

// console.log(isPrime(4));

// const cutFunc = (nums) => {
//   for (let i = 1; i < nums.length; i++) {
//     if (nums.length === 1) break;
//     console.log(nums.slice(i, -i));
//   }
// };

// cutFunc("876543210");

// const f = (n) => (n <= 1 ? 1 : n * f(n - 1));

// let g = f(4);
// console.log(g);

// function all(items) {
//   for (var i = 0; i < items.length; i++) {
//     if (items[i].length == 0) {
//       items.splice(i, 1);
//     }
//   }
// }
// var names = ["os", " ", "al", " ", " ", "ab"];
// console.log(all(names));

// function _(func, items) {
//   let i = 0;
//   for (let item of items) {
//     if (func(item)) {
//       items[i] = itemi += 1;
//     }
//   }
//   items.splice(i);
// }
// console.log(_());

// let x = ["1", "2", "15", "-7", "300"].sort();

// console.log(x);

// function has(array) {
//   let hasPos = false;
//   let hasNeg = false;
//   array.forEach((num) => {
//     hasPos = num > 0;
//     hasNeg = num < 0;
//   });

//   return [hasPos, hasNeg];
// }

// console.log(has([0, 1, 2]));

// function sortBy(arr, pop) {
//   return arr.sort((a, b) => {
//     if (a[pop] < b[pop]) return -1;
//     if (a[pop] > b[pop]) return 1;

//     return 0;
//   });
// }

// const arr3 = [1, 2, 3, 4];
// const date = [0, 1, 0, 2, 0, 3];
// console.log(sortBy());

// function getVal(s) {
//   let root = {};
//   s.forEach((sen) => {
//     let base = root;
//     sen.split(" ").forEach((w) => {
//       if (base[w] === undefined) {
//         base[w] = {};
//       }
//       base = base[root];
//     });
//   });

//   return root;
// }

// let tree = getVal(["Hello world", "Hello there"]);
// console.log(tree);

// function func(a, b) {
//   a += 1;
//   b.push(1);
// }

// const a = 0;
// const b = [];
// func(a, b);
// console.log(a, b);

// function f1(a) {
//   if (a === 0) return 1;
//   return a * f1(a - 1);
// }
// function main() {
//   const f2 = (a, b) => Math.abs(2 * a - 3 * b);
//   console.log(f1(f2(2, 3)));
// }

// main();
