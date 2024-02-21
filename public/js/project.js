export let projectCode = `
<div class="fs-2 justify-content-center script-text">Selected Project</div>
  <div class="row justify-content-center">
    <div class="col-12 col-lg-5 mb-6 p-3 justify-content-center">
      <div class="row justify-content-center">
        <div class="col-12 mt-4">
          <div class="card h-100 m-0 shadow-lg bhf-light">
            <img src="<%= project.img_url  %>" class="card-img-top" alt="..." >
            <div class="title-box border-0">
              <div class="card-title border-0">
                <p class="h3 m-2">
                  <strong>
                    <%=project.project_name  %>
                  </strong>
                </p>
                <p><%=project.medium  %></p>
                <p><%= project.dimensions  %></p>
                <p><%= project.frame  %></p>
                <p><%= project.price  %></p>
              </div>
            </div>
            <div class="card-footer border-0">
            <a href="/#contact" id="add-anchor"><button id="add-button" class="buttons-mint buttons-light btn btn-outline-light">Contact Artist to Purchase</button></a>
              <div id="project-id" class="d-none"><%= project.id %></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-10 col-lg-5 mt-2 p-3 text-start">
      <p><h3 class="topic">Project name: </h3><%=project.project_name  %></p>
      <p><h3 class="topic">Project description: </h3><%=project.project_description  %></p>
      <p><h3 class="topic">Notes: </h3><p id="notes" ><%= project.notes  %></p>
    </div>
  </div>
</div>
`;
