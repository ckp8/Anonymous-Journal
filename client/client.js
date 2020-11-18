//Set up
const form = document.querySelector(".post-form");
const spinner = document.querySelector(".spinner");
const postElement = document.querySelector(".posts");
const content = document.querySelector("#content");
const counterEle = document.createElement("p");

const commentForm = document.createElement("form");
const inputArea = document.createElement("input");

//On-loading hide spinner
spinner.style.display = "none";

loadPosts();
//On load - load all the posts

//counting the characters
content.addEventListener("input", (e) => {
  e.preventDefault();
  const target = e.target;
  const currentLength = target.value.length;
  form.append(counterEle);
  counterEle.textContent = `${currentLength}/200`;

  function checkingForLength(currentLength) {
    if (currentLength > 199) {
      alert("Too many characters, you only can write 199 characters");
      content.disabled = true;
      form.reset();

      content.disabled = false;
    }
  }
  checkingForLength(currentLength);
});

//disabelling the submit button if characters over 200

function loadPosts() {
  //blank out everything there before and then add to the page
  postElement.innerHTML = "";
  fetch("http://localhost:3000/posts")
    .then((r) => r.json())
    .then((posts) => {
      posts.reverse();
      posts.forEach((post) => {
        const div = document.createElement("div");
        div.className = "allposts";
        div.id = `$Post ${post.id}`;
        //headers to show usernames
        const header = document.createElement("h3");
        header.textContent = post.name;

        //post content
        const contents = document.createElement("p");
        contents.textContent = post.content;

        //date
        const date = document.createElement("small");
        const longDate = new Date(post.date);
        date.textContent = longDate;

        const reactionDiv = document.createElement("div");

        //image
        const newImg = document.createElement("img");
        newImg.src = post.giph;
        newImg.style.display = "block";
        newImg.style.margin = "0 auto";
        newImg.alt = "";

        //icons
        const commentIcon = `<i class="far fa-comment"></i>`;
        const likeIcon = `<div><i class="far fa-thumbs-up emojis ${post.id}"></i><span>${post.likes}</span></div>`;
        const dislikeIcon = `<div><i class="far fa-thumbs-down emojis ${post.id}"></i><span>${post.dislikes}</span></div>`;
        const laughIcon = `<div><i class="far fa-laugh-squint emojis ${post.id}"></i><span>${post.laughs}</span></div>`;

        reactionDiv.className = `icons`;

        reactionDiv.innerHTML =
          commentIcon + likeIcon + dislikeIcon + laughIcon;

        //comments

        const commentHeader = document.createElement("h2");
        commentHeader.textContent = "Comments";
        const commentsArray = post.comments;
        const commentDiv = document.createElement("div");
        commentDiv.appendChild(commentHeader);
        commentsArray.forEach((elem) => {
          const p = document.createElement("p");
          p.textContent = elem;
          commentDiv.appendChild(p);
        });

        //appending
        div.appendChild(header);
        div.appendChild(contents);
        div.appendChild(newImg);
        div.appendChild(date);
        div.appendChild(reactionDiv);
        div.appendChild(commentDiv);

        postElement.append(div);
      });
    });
}

//Form submission logic

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = event.target.name.value;
  const content = event.target.content.value;
  const gif = event.target.giphy.value;

  const post = {
    name,
    content,
    gif,
  };

  console.log(post);

  //(Hides form)
  form.style.display = "none";
  //(shows spinner)
  spinner.style.display = "";

  const options = {
    method: "POST",
    body: JSON.stringify(post),
    headers: {
      "content-type": "application/json",
    },
  };

  fetch("http://localhost:3000/posts", options)
    .then((r) => r.text())
    .then((message) => {
      console.log(message);
      form.reset();
      form.style.display = "";
      spinner.style.display = "none";
      loadPosts();
    });
});

//EVENT BUBBLING FOR DYNAMIC DOM MANIPULATION
addCustomEventListener(".emojis", "click", emojiHandler);
addCustomEventListener(".fa-comment", "click", commentClickHandler);
addCustomEventListener(".comment-input", "submit", commentSubmitHandler);
//Generic function to handle event listeners of future elements

function addCustomEventListener(selector, event, handler) {
  let rootElement = document.querySelector(".posts");
  //since the root element is set to be body for our current dealings
  rootElement.addEventListener(
    event,
    function (evt) {
      let targetElement = evt.target;
      while (targetElement != null) {
        if (targetElement.matches(selector)) {
          handler(evt, targetElement);
          return;
        }
        targetElement = targetElement.parentElement;
      }
    },
    true
  );
}

function emojiHandler(evt, targetElement) {
  // console.log(targetElement);
  const targetClass = targetElement.className.baseVal;
  const classArray = targetClass.split(" ");
  const post = {
    emoji: classArray[1],
    id: classArray[4],
  };

  const options = {
    method: "POST",
    body: JSON.stringify(post),
    headers: {
      "content-type": "application/json",
    },
  };

  fetch("http://localhost:3000/emojis", options)
    .then((r) => r.text())
    .then((message) => {
      console.log(message);
      loadPosts();
    });
}

function commentClickHandler(evt, targetElement) {
  const commentForm = document.createElement("form");
  const inputArea = document.createElement("input");
  // const commentButton = document.createElement("button");
  inputArea.type = "text-area";
  commentForm.className = "comment-input";
  inputArea.id = "comment";
  inputArea.name = "comment";
  commentForm.appendChild(inputArea);
  targetElement.parentNode.parentNode.append(commentForm);
}

function commentSubmitHandler(evt, targetElement) {
  debugger;
  evt.preventDefault();
  const idName = targetElement.parentNode.id;
  const id = idName.slice(5);
  console.log(id);
  const comment = targetElement.comment.value;
  const postComment = {
    id,
    comment,
  };
  console.log(comment);
  const options = {
    method: "POST",
    body: JSON.stringify(postComment),
    headers: {
      "content-type": "application/json",
    },
  };
  fetch("http://localhost:3000/comments", options)
    .then((r) => r.text())
    .then((message) => {
      console.log(message);
      form.reset();
      loadPosts();
    });
}

// inputArea.addEventListener("keyup", function (event) {
//   // Number 13 is the "Enter" key on the keyboard
//   const somePost = document.querySelector(".allposts");
//   const comment = event.target.value;
//   if (event.keyCode === 13) {
//     // Cancel the default action, if needed
//     somePost.append(comment);
//   }
//   event.preventDefault();
// });

//emojiCounter logic

// const emojisCollection = document.querySelectorAll(".emojis");

// emojisCollection.forEach((element) => {
//   element.addEventListener("click", (event) => {
//     const classArray = event.target.className.split(" ");
//     const post = {
//       emoji: classArray[2],
//       id: classArray[3],
//     };

//     console.log(post);

//     const options = {
//       method: "POST",
//       body: JSON.stringify(post),
//       headers: {
//         "content-type": "application/json",
//       },
//     };

//     fetch("http://localhost:3000/emojis", options)
//       .then((r) => r.text())
//       .then((message) => {
//         console.log(message);
//         loadPosts();
//       });
//   });
// });

//EVENT BUBBLING SOLUTION TO EMOJI COUNTER

// let rootElement = document.querySelector(".posts");

// rootElement.addEventListener(
//   "click",
//   (event) => {
//     let targetElement = event.target
//     let selector = ".emojis";
//     while(targetElement != null){
//     if (targetElement.matches(selector)){

//logic for handling the click event of .emoji class
//       console.log(targetElement);
//       const targetClass = targetElement.className.baseVal;
//       const classArray = targetClass.split(" ");
//       const post = {
//         emoji: classArray[1],
//         id: classArray[4],
//       }

//       const options = {
//         method: "POST",
//         body: JSON.stringify(post),
//         headers: {
//           "content-type": "application/json",
//         },
//       };

//       fetch("http://localhost:3000/emojis", options)
//       .then((r) => r.text())
//       .then((message) => {
//       console.log(message);
//       loadPosts();
//       return;
//     }
//     targetElement = targetElement.parentElement;
//   }
//   }

//   },
//   true
// );

// emojis.addEventListener("click", (event) => {
//   const postId = event.target.parentNode.id.slice(7);
//   const post = {
//     emoji: event.target.className.slice(0, -7),
//     id: postId,
//   };

//   console.log(post);

//   const options = {
//     method: "POST",
//     body: JSON.stringify(post),
//     headers: {
//       "content-type": "application/json",
//     },
//   };

//   fetch("http://localhost:3000/emojis", options)
//     .then((r) => r.text())
//     .then((message) => {
//       console.log(message);
//       loadPosts();
//     });
// });
