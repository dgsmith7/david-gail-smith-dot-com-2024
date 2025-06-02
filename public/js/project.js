export let projectCode = `
<div class="selected-project-section">
  <div class="fs-2 text-center script-text mb-4">Selected Project</div>
  <div class="row justify-content-center align-items-start g-4">
    <div class="col-12 col-lg-6 mb-4">
      <div class="card selected-project-card shadow-lg h-100 m-0 p-0" style="max-width:700px;">
        <img src="<%= project.img_url %>" class="card-img-top selected-project-img" alt="<%= project.project_name %>" style="max-height:520px; width:100%; object-fit:contain; background:#fff;">
        <div class="card-body p-4">
          <h3 class="card-title mb-2"><%= project.project_name %></h3>
          <p class="card-text mb-1"><strong>Category:</strong> <%= project.category %></p>
          <p class="card-text mb-0"><small class="text-muted">Created: <%= project.date_created %></small></p>
        </div>
      </div>
    </div>
    <div class="col-12 col-lg-6 mb-4">
      <div class="selected-project-details ps-lg-4">
        <h4>Project Details</h4>
        <p><strong>Description:</strong> <%= project.project_description ? project.project_description : '' %></p>
        <p><strong>Medium:</strong> <%= project.medium ? project.medium : '' %></p>
        <p><strong>Dimensions:</strong> <%= project.dimensions ? project.dimensions : '' %></p>
        <p><strong>Frame:</strong> <%= project.frame ? project.frame : '' %></p>
        <p><strong>Price:</strong> <%= project.price ? project.price : '' %></p>
        <div id="notes"></div>
      </div>
    </div>
  </div>
</div>
`;
