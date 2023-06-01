var button = '<button class="close" type="button" title="Remove this page">×</button>';
var tabID = 1;

function resetTab() {
  //var tabs = $("#nav-tab");
  //var tabs = $("#nav-tab li");
  //var len = 1
  //var triggerEl = document.querySelector('#nav-tab a[href="#profile"]')
  //bootstrap.Tab.getInstance(triggerEl).show() // Select tab by name

  console.log("lista de tabs")
  //console.log(tabs)

  //console.log($('.nav-tabs a[href="#nav-home-tab"]'))


  //$(tabs).each(function (k, v) {
    //len++;
    //$(this).find('a').html('Tab ' + len + button);
  //  console.log("a")
  //  console.log($(this).TabName);
  //})



  var triggerTabList = [].slice.call(document.querySelectorAll('#nav-tab'))
  console.log(triggerTabList)
  triggerTabList.forEach(function (triggerEl) {
      console.log(triggerEl)
  //   var tabTrigger = new bootstrap.Tab(triggerEl)
  
  //   triggerEl.addEventListener('click', function (event) {
  //     event.preventDefault()
  //     tabTrigger.show()
  //   })
  })

  //tabID--;
  //$('#nav-tab').
}

function addTab(TabName) {
  var navTag = `<button class="nav-link" id="nav-${tabID}-tab" data-bs-toggle="tab" data-bs-target="#nav-${tabID}-control" type="button" role="tab" aria-controls="nav-${tabID}-control" aria-selected="false">Tab ${tabID}</button>`
  var navContent = `<div class="tab-pane fade" id="nav-${tabID}-control" role="tabpanel" aria-labelledby="nav-${tabID}-tab">Content Tab ${tabID}</div>`

  $('#nav-tab').append(navTag);
  $('#nav-tabContent').append(navContent);
}

$(document).ready(function () {

  $('#btn-add-tab').click(function () {
    tabID++;

    //addTab(tabID);

    resetTab();

  });

});