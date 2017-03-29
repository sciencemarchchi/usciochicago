

fetch('https://sheets.googleapis.com/v4/spreadsheets/1pQ_25IvbXo1cNQ9fBGciPdbB4dD6-lpozHvsqR8tzhc/values/A1%3AB2?majorDimension=ROWS&key=AIzaSyCS4kkuXOuY9sVI1Ik2_K11Fyj01inSbkQ')
.then(function(response) {
    var contentType = response.headers.get("content-type");
    if(contentType && contentType.indexOf("application/json") !== -1) {
        return response.json().then(function(json) {
            console.log(json);
            var arrData = json.values;
            //   var mappedJSON = json.values.map(function(d) {
            var object = {};
            json.values.forEach(function(d) {
                object[d[0]] = Number(d[1].replace(/[^0-9.]/g, ""));
            });
            //   object[d[0]] = d[1].replace(/[^0-9.]/g, "");
            // object[arrData[0][0]] = arrData[0][1].replace(/[^0-9.]/g, "");
            // object[arrData[0][0]] = arrData[0][1].replace(/[^0-9.]/g, "");
            // object[]
            //   return object;
            //   });
            //   console.log(mappedJSON);
            bustOutD3(object);
        });
    } else {
        console.log("Oops, we haven't got JSON!");
    }
});

var bustOutD3 = function(datas) {
    console.log(datas);
    // var stacker = d3.stack();
    // var stackData = stacker(data);
    // console.log(stackData);
    var data = [[0, datas["Merch total"], "merchandise"],
    [datas["Merch total"], datas["Merch total"] + datas["Donation total"], "donations"]];
    var goal = [85000];
    var view = document.querySelector(".graph > div > div").getBoundingClientRect();
    var width = view.width;
    var barHeight = width / 20;

    var x = d3.scale.linear()
    .range([0, width])
    .domain([0, goal]);

    var goal_x = d3.scale.linear()
    .range([0, goal]);

    var chart = d3.select(".chart")
    .attr("width", width)
    .attr("height", width/8);

    chart.append("rect")
    .attr("width", 0)
    .attr("height", barHeight - 1)
    .attr("class", "goal")
    .attr("fill", "rgba(208, 228, 242, 1)")
    .transition()
    .duration(1000)
    .attr("width", width)
    .each("end", function() {
        text = chart.append("text")
        .attr("x", width-5)
        .attr("text-anchor", "end")
        .attr("y", barHeight)
        .attr("dy", '1em')
        .attr("class", "goal")
        .text("$" + goal.toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ','))
        .transition()
        .style("opacity", 1)
        chart.append("text")
        .attr("x", width-5)
        .attr("text-anchor", "end")
        .attr("y", barHeight)
        .attr("dy", '2em')
        // .attr("class", "goal")
        .text("goal")
        .transition()
        .style("opacity", 1)
    })

    var bar = chart.selectAll("g")
    .data(data)
    .enter()
    .append("g");
    bar.append("rect")
    .attr("x", function(d) {return x(d[0])})
    .attr("fill", "red")
    .attr("width", 0)
    .attr("height", barHeight - 1)
    .attr("class", "goal")
    .transition()
    .duration(1000)
    .delay(function(d,i){return 1000 * i})
    .attr("width", function(d) {return x(d[1])})
    .attr("fill", function(d,i) {return "hsla(0" + (120 * 2 * i % 360) + ", 100%, 75%, 1)"})

    bar
    .append("text")
    .attr("y", barHeight)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .attr("x", function(d,i) {console.log(x(d[1]));return x(d[1]+d[0])})
    .text(function(d,i) {return "$" + (d[1]-d[0]).toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ',')})
    .transition()
    .duration(1000)
    .delay(function(d,i){return 1500 * i})
    .style("opacity", 1);
    bar
    .append("text")
    .attr("y", barHeight)
    .attr("dy", "2em")
    .style("text-anchor", "middle")
    .attr("x", function(d,i) {console.log(x(d[1]));return x(d[1]+d[0])})
    .text(function(d,i) {return d[2]})
    // .attr("transform", "rotate(3)")
    .transition()
    .duration(1000)
    .delay(function(d,i){return 1500 * i})
    .style("opacity", 1);
    d3.select(".goal").on("click", function() {
        $('html, body').animate({
            scrollTop: $(".why").offset().top
        }, 1000);
    });

    function type(d) {
        d.value = +d.value; // coerce to number
        return d;
    }
    window.addEventListener('load', function() {
        var menu = document.querySelector('.graph div');
        var menuPosition = menu.getBoundingClientRect();
        var spaceToTop = menuPosition.top;
        var placeholder = document.createElement('div');
        placeholder.style.width = menuPosition.width + 'px';
        placeholder.style.height = menuPosition.height + 'px';
        $(this).scrollTop(0);
        menu.style.position = 'static';
        var absolutePosition = menu.getBoundingClientRect().top;

        var stickyMover = (window.matchMedia("only screen and (max-device-width: 736px)").matches ?
        function() {
            menu.style.position = 'relative';
            menu.style.top = '0px';
            menu.parentNode.removeChild(placeholder);

        } :
        function() {
            menu.style.position = 'static';
            menu.style.top = 0 + 'px';
            menu.parentNode.removeChild(placeholder);

        });

        window.addEventListener('scroll', function() {
            var yOffset = window.pageYOffset;
            // console.log(menu.style.position);

            if (yOffset >= absolutePosition && menu.style.position !== 'fixed') {
                menu.style.position = 'fixed';
                menu.style.top = 0;
                menu.parentNode.insertBefore(placeholder, menu);
                topHit();
            } else if (yOffset < absolutePosition && menu.style.position == 'fixed') {
                // stickyMover();
                menu.style.position = 'static';
                menu.style.top = 0 + 'px';

                menu.parentNode.removeChild(placeholder);
                topSplit();
            }
        });
    });

    var topHit = function() {
        d3.selectAll('text').transition().style("opacity", 0);
    }
    var topSplit = function() {
        d3.selectAll('text').transition().style("opacity", 1);
    }
}
