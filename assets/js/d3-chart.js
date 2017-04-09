fetch('https://sheets.googleapis.com/v4/spreadsheets/1pQ_25IvbXo1cNQ9fBGciPdbB4dD6-lpozHvsqR8tzhc/values/A1%3AB3?majorDimension=ROWS&key=AIzaSyCS4kkuXOuY9sVI1Ik2_K11Fyj01inSbkQ')
.then(function(response) {
    var contentType = response.headers.get("content-type");
    if(contentType && contentType.indexOf("application/json") !== -1) {
        return response.json().then(function(json) {
            console.log(json);
            var arrData = json.values;
            var object = {};
            json.values.forEach(function(d) {
                object[d[0]] = Number(d[1].replace(/[^0-9.]/g, ""));
            });
            makeChart(object);
        });
    } else {
        console.log("Oops, we haven't got JSON!");
    }
});

var makeChart = function(datas) {
    var data = [[0, datas["Merch total"], "merch"],
    [datas["Merch total"], datas["Merch total"] + datas["Donation total"], "donations"],
    [datas["Merch total"] + datas["Donation total"], datas["Merch total"] + datas["Donation total"] + datas["Event total"], "events"]];
    var goalData = [["toilets", 10875],["fences", 10180],["misc. costs", 12000],["security", 16500],["medical staff", 1320],["insurance", 18962],["tables/chairs/tents", 5900],["waste/recycling", 900],["av equip  ", 8909]];
    // var goal = [d3.sum(goalData,function(d){return d[1]})];
    var goal = [85000];
    var stackedGoal = goalData.map(function(item, i, arr){return [item[0],d3.sum(goalData.slice(0,i),function(d){return d[1]}),item[1]]});
    var view = document.querySelector(".graph > div > div").getBoundingClientRect();
    var width = view.width;
    var barHeight = width / 20;

    var x = d3.scaleLinear()
    .range([0, width])
    .domain([0, goal]);

    var goal_x = d3.scaleLinear()
    .range([0, goal]);

    var chart = d3.select(".chart")
    .attr("width", width)
    .attr("height", width/4);

    chart.append("rect")
    .attr("y", 0)
    .attr("height", 0)
    .attr("width", 0)
    .attr("class", "goal")
    .attr("width", width)
    .attr("fill", "rgba(208, 228, 242, 1)")
    .transition()
    .duration(1000)
    .delay(500)
    .attr("height", barHeight)
    // .attr("y", 0)
    .on("end", function() {
        text = chart.append("text")
        .attr("x", width-5)
        .attr("text-anchor", "end")
        .attr("y", barHeight)
        .attr("dy", '1em')
        .attr("class", "goal-amount")
        .text("$" + goal.toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ','))
        .transition()
        .style("opacity", 1);

        chart.append("text")
        .attr("x", width-5)
        .attr("text-anchor", "end")
        .attr("y", barHeight)
        .attr("dy", '2em')
        .text("goal")
        .transition()
        .style("opacity", 1)
    });

    var bar = chart.selectAll("g")
    .data(data)
    .enter()
    .append("g");

    bar.append("rect")
    .transition()
    .delay(1500)
    .attr("class", "raised")
    .attr("x", function(d) {return x(d[0])})
    .attr("fill", "red")
    .attr("width", 0)
    .attr("y", 0)
    .attr("height", barHeight - 1)
    .transition()
    .duration(750)
    .delay(function(d,i){return 1000 * i})
    .attr("width", function(d) {return x(d[1]-d[0])})
    .attr("fill", function(d,i) {return "hsla(" + ((240 + (70 * i)) % 360) + ", 100%, 65%, 1)"})
    .on("end", function(){
        d3.selectAll(".raised")
        .on("mouseover", mouseInHandler)
        .on("mouseout", mouseOutHandler);
    });

    chart.append("text")
    .attr("x", x(data[2][1]/2))
    .attr("class", "raised-amount")
    .attr("text-anchor", "middle")
    .attr("y", barHeight)
    .attr("dy", '1em')
    .transition()
    .delay(750 + data.length * 1000)
    .duration(750)
    .style("opacity", 1)
    .text("$"+data[2][1].toFixed(2).toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ','));

    chart.append("text")
    .style("font-size", width/52+"px")
    .attr("x", x(data[2][1]/2))
    .attr("class", "raised-type")
    .attr("text-anchor", "middle")
    .attr("y", barHeight)
    .attr("dy", '2em')
    .transition()
    .delay(750 + data.length * 1000)
    .duration(750)
    .style("opacity", 1)
    .text("raised")
    .on("end", buildBudgetBar);

    function mouseInHandler(d, i) {
        console.log(d);
        console.log(i);
        console.log(this);
        d3.select(this).attr("fill", "hsla(" + ((240 + (70 * i)) % 360) + ", 100%, 80%, 1)");
        d3.select('.raised-amount').text("$"+(d[1]-d[0]).toFixed(2).toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ','));
        d3.select('.raised-type').text(d[2]);

    }
    function mouseOutHandler(d, i) {
        d3.select(this).attr("fill", "hsla(" + ((240 + (70 * i)) % 360) + ", 100%, 65%, 1)");
        d3.select('.raised-amount').text("$"+data[2][1].toFixed(2).toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ','));
        d3.select('.raised-type').text("raised");

    }

    d3.select(".goal").on("click", function() {
        $('html, body').animate({
            scrollTop: $(".why").offset().top
        }, 1000);
    });

    function type(d) {
        d.value = +d.value;
        return d;
    }

    function buildBudgetBar() {
        var bar2 = chart.selectAll("g.goalbar")
        .data(stackedGoal)
        .enter()
        .append("g")
        .attr("class", "goalbar");

        bar2.append("rect")
        // .attr("y", barHeight)
        .attr("class", "budget")
        .attr("dy", "3em")
        .attr("fill", "red")
        .attr("height", 0)
        .attr("width", function(d) {return x(d[2])})
        .attr("transform", function(d){console.log(d); return "translate(" + x(d[1]) + "," + barHeight*2 + ")"})
        .transition()
        .duration(500)
        .attr("height", barHeight)
        // .attr("width", function(d) {return x(d[2])})
        .attr("fill", function(d,i) {return "hsla(" + ((185 + (i*15)) % 360) + ", 100%, 75%, 1)"})
        d3.selectAll('.budget')
        .on("mouseover", goalbarMouseIn)
        .on("mouseout", goalbarMouseOut);}

        function goalbarMouseIn(d, i) {
            console.log(d);
            console.log(i);
            console.log(d3.select(this));
            d3.select(this.parentNode)
            .append("text")
            .attr("y", barHeight*3)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .attr("x", function(d,i) {return x(d[1]+(d[2]/2))})
            .text(function(d,i) {return "$" + (d[2]).toFixed(2).toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ',')})
            .transition()
            .duration(200)
            .style("opacity", 1);

            d3.select(this.parentNode)
            .append("text")
            .attr("y", barHeight*3)
            .attr("dy", "2em")
            .style("text-anchor", "middle")
            .attr("x", function(d,i) {return x(d[1]+(d[2]/2))})
            .text(function(d,i) {return d[0]})
            .transition()
            .duration(200)
            // .delay(function(d,i){return 1000 * i})
            .style("opacity", 1);
        }
        function goalbarMouseOut(d, i) {
            d3.select(this.parentNode).selectAll('text')
            .transition()
            .duration(200)
            .style("opacity", 0)
            .remove()
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


    // March for Science Fundraising Accountability Page by Alexander Shoup
