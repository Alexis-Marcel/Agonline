export function setSolution(param,solution){

    let sol = "#"+solution;
    if(param === "afficher"){
      $("#A, #B, #C, #D").removeClass("bg-light");
      $("#A, #B, #C, #D").addClass("text-white");
      $("#A, #B, #C, #D").removeClass("text-dark");
      $("#A, #B, #C, #D").addClass("bg-danger");
      $(sol).removeClass("bg-danger");
      $(sol).addClass("bg-success");
    }
    else {
      $("#A, #B, #C, #D").addClass("bg-light");
      $("#A, #B, #C, #D").removeClass("text-white");
      $("#A, #B, #C, #D").addClass("text-dark");
      $("#A, #B, #C, #D").removeClass("bg-danger");
      $(sol).removeClass("bg-success");
    }
    
  }
