
/**
 * Define offset and limit for pagination pupose
 * Define user object
 */
let offset = 0,
  limit = 10,
  total = 0,
  creating = false,
  updating = false,
  user = {
    email: "",
    username: "",
    role: "author",
    password: ""
  };

/**
 * Form user
 */
const FORM = () => `<div class="modal-dialog">
<div class="modal-content">
  <div class="modal-header">
    <h5 class="modal-title" id="userModalLabel">${updating ? `Update user: ${user.username}` : "Create new user"}</h5>
    <button type="button"  class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
  </div>
  <div class="modal-body">
  <div class="mb-3">
     <label for="email" class="form-label">Email address</label>
     <input name="email" type="email" value="${user.email}" class="form-control" id="email" placeholder="name@example.com">
  </div>
  <div class="mb-3">
     <label for="username" class="form-label">Username</label>
     <input name="username" type="text" class="form-control" value="${user.username}" id="username" placeholder="username ...">
  </div>
  <div class="mb-3">
     <label for="password" class="form-label">Password</label>
     <input name="password" type="password" class="form-control" value="${user.password}" id="password" placeholder="Password..">
  </div>
  </div>
  <div class="modal-footer">
    <button type="button"  class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
    <button type="button" id="submit-user-modal-button" class="btn btn-primary">${updating ? `Update` : "Create"}</button>
  </div>
</div>
</div>`

/**
 * Modal template
 */
const MODAL = () => `
 <div class="modal fade" id="userModal" tabindex="-1" aria-labelledby="userModalLabel" aria-hidden="true">
    ${FORM()}
 </div>`

const reRenderModal = () => {
  document.getElementById("userModal").innerHTML = FORM();
}

/**
 * Users table template
 */
const USERS_TABLE = `<div id="users">
<ul class="pagination d-flex justify-content-between">
<li class="page-item" ><button class="btn btn-primary" id="add-user" data-bs-toggle="modal" data-bs-target="#userModal">Add</button></li>
<ul class="pagination d-flex justify-content-end">
<li class="page-item" ><button id="previous-page" class="page-link" >Previous</button></li>
<li class="page-item" ><button id="next-page" class="page-link" >Next</button></li>
</ul>
</ul>
<table class="table table-striped">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Email</th>
      <th scope="col">Username</th>
      <th scope="col"></th>
      <th scope="col"></th>
    </tr>
  </thead>
  <tbody id="body-table-user"></tbody>
</table>
${MODAL()}
</div>`

/**
 * User row template
 */
const USER_ROW = (user) => ` <tr>
<th scope="row">${user.id}</th>
<td>${user.email}</td>
<td>${user.username}</td>
<td><button id="update-user-${user.id}" data-bs-toggle="modal" data-bs-target="#userModal" class="btn btn-primary" >Update</button></td>
<td><button id="delete-user-${user.id}" class="btn btn-danger" >Delete</button></td>
</tr>`

/**
 * Fetch list of users with pagination
 */
const fetchUsers = () => fetch(`/users?offset=${offset}&limit=${limit}`)
  .then((response) => response.json())
  .then((data) => {
    document.getElementById("body-table-user").innerHTML = "";
    total = data.count;
    data && data.users.forEach((user) => insertUser(user));

    /**
    * Bind click event to the buttons:  delete & update 
    */
    data && data.users.forEach(user => {
      // Delete button
      document.getElementById(`delete-user-${user.id}`).onclick = (e) => {
        e.preventDefault();
        deleteUser(user.id);
      }

      // Update button 
      document.getElementById(`update-user-${user.id}`).onclick = (e) => {
        e.preventDefault();
        toggleUpdate(user);
      }
    })

    /**
     * Bind click event to the button add
     */
    document.getElementById(`add-user`).onclick = (e) => {
      e.preventDefault();
      toggleCreate();
    }
  });

/**
 * Create user
 */
const createUser = (user) => {
  fetch(`/users`, { method: "POST", body: JSON.stringify(user), headers: { "Content-Type": "application/json; charset=utf-8" } })
    .then((response) => response.json())
    .then((data) => {
      fetchUsers();
    });
}

/**
 * Update user
 */
const updateUser = (user) => {
  fetch(`/users`, { method: "PUT", body: JSON.stringify(user), headers: { "Content-Type": "application/json; charset=utf-8" } })
    .then((response) => response.json())
    .then((data) => {
      fetchUsers();
    });
}

/**
 * Delete user 
 */
const deleteUser = (id) => {
  fetch(`/users/${id}`, { method: "DELETE" })
    .then((response) => response.json())
    .then((data) => {
      fetchUsers();
    });
}


/**
 * Handle input change
 */
const handleChange = (e) => {
  e.preventDefault();
  user[e.target.name] = e.target.value;
}

/**
 * Toggle update user
 */
const toggleUpdate = (currentUser) => {
  creating = false;
  updating = true;
  user = currentUser;
  reRenderModal();
  document.getElementById("submit-user-modal-button").onclick = (e) => {
    e.preventDefault();
    updateUser(user);
  }
  for (let index = 0; index < document.getElementsByTagName("input").length; index++)
  {
    const element = document.getElementsByTagName("input").item(index);
    element.onchange = handleChange;
  }
}

/**
 * Toggle update user
 */
const toggleCreate = () => {
  creating = true;
  updating = false;
  user = {
    email: "",
    username: "",
    role: "author",
    password: ""
  };
  reRenderModal();
  document.getElementById("submit-user-modal-button").onclick = (e) => {
    e.preventDefault();
    createUser(user);
  }
  for (let index = 0; index < document.getElementsByTagName("input").length; index++)
  {
    const element = document.getElementsByTagName("input").item(index);
    element.onchange = handleChange;
  }
}

/**
* insert user in the table
*/
const insertUser = (user) => {
  document.getElementById("body-table-user").innerHTML += USER_ROW(user);
};

/**
* Go to page
*/
const goto = (type = "next") => {
  offset = offset + (type == "next" ? 10 : -10);
  if (offset >= 0 && offset < total) fetchUsers();
  else offset = offset - (type == "next" ? 10 : -10);
}

/**
 *Init users table
 */
const init = () => {

  /**
   * Init users table
   */
  document.body.innerHTML += USERS_TABLE;

  /**
   * Fetch users list
   */
  fetchUsers();

  /**
 * Bind click event to the button previous
 */
  document.getElementById("previous-page").onclick = (e) => {
    e.preventDefault();
    goto("previous");
  }

  /**
   * Bind click event to the button next
   */
  document.getElementById("next-page").onclick = (e) => {
    e.preventDefault();
    goto();
  }

}

init();


