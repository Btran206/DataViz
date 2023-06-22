import { csv } from 'd3';


function assignment9(){
    var filePath="data/data1.csv";
    question0(filePath);
    question1(filePath);
    question2(filePath);
    question3(filePath);
    question4(filePath);
    question5(filePath);
}

var question0=function(filePath){
    d3.csv(filePath).then(function(data){
        console.log(data)
    });
}

var question1=function(filePath){
    
    //reading data
    d3.csv(filePath).then(data=>{
        svgheight = 500;
        svgwidth = 900;
        padding = 60;
        var filtered = data.filter(function(d){if(d.workers > 0){return d}})
        var svg = d3.select("#q1_plot").append("svg")
				.attr("width", svgwidth)
				.attr("height", svgheight);
        var xScale = d3.scaleLinear().domain([0, 10]).range([padding, svgwidth - padding]);
		var yScale = d3.scaleLinear().domain([Math.log(d3.min(filtered, function(d){return parseFloat(d.revenue)})), 10]).range([svgheight - padding, padding]);

        const xAxis = d3.axisBottom().scale(xScale);
		const yAxis = d3.axisLeft().scale(yScale);
      
        svg.selectAll("dots")
				.data(filtered).enter().append("circle")
				.attr("cx", function (d) {
					return xScale(Math.log(parseFloat(d.workers)));
				})
				.attr("cy", function (d) {
					return yScale(Math.log(parseFloat(d.revenue)));
				})
				.attr("r", 2)
                .attr("fill", "blue")
        
        svg.append("g").call(xAxis).attr("class", "xAxis1").attr("transform","translate(0," + (svgheight - padding) + ")")
		svg.append("g").call(yAxis).attr("class", "yAxis1").attr("transform","translate(" + padding + ",0)")

        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", svgwidth/2 + 90)
            .attr("y", svgheight - 6)
            .text("Number of Workers");

        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", 4)
            .attr("x", -180)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text("Revenue (Millions)");
        
        svg.append("text")
            .attr("class", "title")
            .attr("text-anchor", "end")
            .attr("x", svgwidth - 200)
            .attr("y", svgheight - 450)
            .style('font-size', 30)
            .text("Revenue V. Workers (Log)");
    })
}
//
var question2=function(filePath){
    var rowConverter = function(d){
        return {'name' : d.name, 'revenue': parseFloat(d.revenue)}
    }
    d3.csv(filePath, rowConverter).then(function(data){
        console.log(data)
        sorted = data.sort(function(a, b){
            if (a.revenue < b.revenue){
                return 1;
            }
            if (a.revenue > b.revenue){
                return -1;
            }
            return 0;
        });

        current_slice = 10
        var companies = {
            10: sorted.slice(0, 10),
            20: sorted.slice(0, 20),
            30: sorted.slice(0, 30)
        }

        var slice = companies[current_slice];
        var names = []
        for (i in slice){
            names.push(slice[i]['name'])
        }

        var svgheight = 800;
		var svgwidth = 900;
        var padding = 100;
        var svg = d3.select("#q2_plot").append("svg")
				.attr("height", svgheight)
				.attr("width", svgwidth);

        var Tooltip = d3.select("#q2_plot").append("div").style("opacity", 0).attr("class", "tooltip");
        var xScale = d3.scaleBand().domain(names).range([padding, svgwidth - padding]).paddingInner([.09]);
		var yScale = d3.scaleLinear().domain([0, d3.max(slice, function(d){return d.revenue})]).range([svgheight - padding, padding])

        var xAxis = d3.axisBottom().scale(xScale);
		var yAxis = d3.axisLeft().scale(yScale);

        svg.selectAll(".bar").data(slice).enter()
				.append("rect")
				.attr("class", "bar")
				.attr("x", function (d) { return xScale(d.name)})
				.attr("y", function (d) { return yScale(d.revenue)})
				.attr("width", xScale.bandwidth())
				.attr("height", function (d) { return svgheight -  yScale(d.revenue) - padding})
                .attr("fill", "dodgerblue")
                .on("mouseover", function (e, d) {
                    Tooltip.style("opacity", 1)
                            .text(d.revenue);
                    d3.select(this)
                        .style("stroke", "violet")
                        .style("stroke-width", 2)
                        .style("opacity", 1)     
                })
                .on("mousemove", function (e, d) {
                    positions = this.getBoundingClientRect();
                    Tooltip.style("left", positions.x + 70  + window.scrollX + "px")		
                    .style("top",  positions.y - 30 +  window.scrollY + "px");	
                })
                .on("mouseout", function (e, d) {
                    Tooltip.style("opacity", 0)
                    d3.select(this)
                        .style("stroke", "none")
                 });
        
        svg.append("g").call(xAxis).attr("class", "xAxis").attr("transform","translate(0," + (svgheight - padding) + ")")
            .selectAll("text")
            .attr("transform", "rotate(-25)")
            .style("text-anchor", "end")
            .style("font-size", 10)
            .attr("dx", "-.8em")
            .attr("dy", ".15em")

		svg.append("g").call(yAxis).attr("class", "yAxis").attr("transform", "translate(" + padding + ",0)")

        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", 4)
            .attr("x", -350)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .style("font-size", 20)
            .text("Revenue (Millions)");
        
        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", svgwidth/2 + 50)
            .attr("y", svgheight - 6)
            .style("font-size", 20)
            .text("Company Name");

        svg.append("text")
            .attr("class", "title")
            .attr("text-anchor", "end")
            .attr("x", svgwidth - 150)
            .attr("y", svgheight - 650)
            .style('font-size', 30)
            .text("Distribution of Revenue by Company");

        var radio = d3.select('#radio')
                .attr('name', 'year').on("change", function (d) {
                        current_slice = d.target.value; //getting the value of selected radio button
                        c_data = companies[current_slice]; //filtering for current year
                        var names = []
                        for (i in c_data){
                            names.push(c_data[i]['name'])
                        }
                        xScale = d3.scaleBand().domain(names).range([padding, svgwidth - padding]).paddingInner([.09]);
                        xAxis = d3.axisBottom().scale(xScale);
                        d3.selectAll("g.xAxis")
                            .transition()
                            .call(xAxis)
                            .style("text-anchor", "end")
                            .style("font-size", 10)
                            .attr("dx", "-.8em")
                            .attr("dy", ".15em")
                            .selectAll("text")
                            .attr("transform", "rotate(-25)")

                        var update = svg.selectAll("rect").data(c_data)
                        update.exit().remove()
                        update.enter().append("rect")
                            .merge(update)
                            .transition()
                            .duration(1000)
                            .attr("x", d => xScale(d.name))
				            .attr("y", d => yScale(d.revenue))
				            .attr("width", xScale.bandwidth())
				            .attr("height", d => svgheight - yScale(d.revenue) - padding)
                            .attr("fill", "dodgerblue")
                        
                        svg.selectAll("rect").on("mouseover", function (e, d) {
                            Tooltip.style("opacity", 1)
                                    .text(d.revenue);
                            d3.select(this)
                                .style("stroke", "violet")
                                .style("stroke-width", 2)
                                .style("opacity", 1)     
                        })
                        .on("mousemove", function (e, d) {
                            positions = this.getBoundingClientRect();
                            Tooltip.style("left", positions.x + 70  + window.scrollX + "px")		
                            .style("top",  positions.y - 30 +  window.scrollY + "px");	
                        })
                        .on("mouseout", function (e, d) {
                            Tooltip.style("opacity", 0)
                            d3.select(this)
                                .style("stroke", "none")
                         });
                    })
        
    });
}
var question3=function(filePath){
    rowConverter = function(d){
        return {'industry' : d.industry, 'state': d.state}
    }
    d3.csv(filePath, rowConverter).then(function(data){
        var top_4 = d3.rollup(data, v => v.length, d => d.industry)
        var top_4 = Array.from(top_4).sort(function(a, b){
            if (a[1] < b[1]){
                return 1;
            }
            if (a[1] > b[1]){
                return -1;
            }
            return 0;
        }).slice(0, 4)

        var shortList = []

        for (i in top_4){
            shortList.push(top_4[i][0])
        }

        var filtered = data.filter(function(d){if (shortList.includes(d.industry))return d})
        var grouped = Array.from(d3.rollup(filtered, v => v.length, d => d.state, d => d.industry))
        var processed = []
        var states = []
        console.log(shortList)

        for (i in grouped){
            temp = {}
            obj = Object.fromEntries(grouped[i][1])
            temp['state'] = grouped[i][0]
            states.push(grouped[i][0])

            if(obj['Advertising & Marketing'] == undefined){
                temp['Advertising & Marketing'] = 0
            }
            else{
                temp['Advertising & Marketing']  = obj['Advertising & Marketing']
            }

            if(obj['Health'] == undefined){
                temp['Health'] = 0
            }
            else{
                temp['Health']  = obj['Health']
            }

            if(obj['Software'] == undefined){
                temp['Software'] = 0
            }
            else{
                temp['Software']  = obj['Software']
            }

            if(obj['Business Products & Services'] == undefined){
                temp['Business Products & Services'] = 0
            }
            else{
                temp['Business Products & Services']  = obj['Business Products & Services']
            }
             
            processed.push(temp)
        }
        
        svgheight = 600;
        svgwidth = 1000;
        padding = 80;

        let stackgenerator = d3.stack().keys(shortList);
        let stacked = stackgenerator(processed)
        var xScale = d3.scaleBand()
						.domain(d3.range(processed.length))
						.range([padding, svgwidth - padding])
						.paddingInner(0.1);
        var yScale = d3.scaleLinear().domain([0, 300]).range([svgheight - padding, padding])

        const xAxis = d3.axisBottom().scale(xScale).tickFormat(function(d, i){return states[i]});
		const yAxis = d3.axisLeft().scale(yScale);

        var colors = ['#F5C63C', '#F47F6B', '#7A5197', '#5344A9']

        var svg = d3.select("#q3_plot").append("svg")
				.attr("width", svgwidth)
				.attr("height", svgheight);
        
        var groups = svg.selectAll(".gbars").data(stacked).enter().append("g").attr("class", "gbars").attr('fill', function(d, i){return colors[i]})
        
        var rects = groups.selectAll("rect").
					data(function(d){return d}).enter().
					append('rect').
					attr('x', function(d, i){return xScale(i)}).
					attr('y', function(d){return yScale(d[1])}).
					attr('width', function(d){return xScale.bandwidth()}).
					attr('height', function(d){return yScale(d[0]) - yScale(d[1])})
        
        groups.append("g").call(xAxis).attr("class", "xAxis2").attr("transform","translate(0," + (svgheight - padding) + ")").selectAll("text")
                                                                                                    .attr("transform", "rotate(-45)")
                                                                                                    .style("text-anchor", "end")
                                                                                                    .attr("dx", "-.8em")
                                                                                                    .attr("dy", ".15em")

        groups.append("g").call(yAxis).attr("class", "yAxis2").attr("transform", "translate(" + padding + ",0)")

        svg.append("circle").attr("cx",800).attr("cy",270).attr("r", 4).style("fill", "#F5C63C")
        svg.append("circle").attr("cx",800).attr("cy",290).attr("r", 4).style("fill", "#F47F6B")
        svg.append("circle").attr("cx",800).attr("cy",310).attr("r", 4).style("fill", "#7A5197")
        svg.append("circle").attr("cx",800).attr("cy",330).attr("r", 4).style("fill", "#5344A9")
        svg.append("text").attr("x", 810).attr("y", 270).text("Business Products & Services").style("font-size", "12px").attr("alignment-baseline","middle")
        svg.append("text").attr("x", 810).attr("y", 290).text("Advertising & Marketing").style("font-size", "12px").attr("alignment-baseline","middle")
        svg.append("text").attr("x", 810).attr("y", 310).text("Software").style("font-size", "12px").attr("alignment-baseline","middle")
        svg.append("text").attr("x", 810).attr("y", 330).text("Health").style("font-size", "12px").attr("alignment-baseline","middle")

        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", 4)
            .attr("x", -250)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .style("font-size", 20)
            .text("Industry Counts");
        
        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", svgwidth/2 + 10)
            .attr("y", svgheight - 30)
            .style("font-size", 20)
            .text("State");

        svg.append("text")
            .attr("class", "title")
            .attr("text-anchor", "end")
            .attr("x", svgwidth - 110)
            .attr("y", svgheight - 480)
            .style('font-size', 30)
            .text("Top 4 Overall Industries by State");
    });   
}

var question4=function(filePath){
        d3.csv(filePath).then(function(data){
            var filtered = data.filter(function(d){if(d.metro == 'San Diego'){return d}})
            var columnSums = ['workers', 'previous_workers']
            var grouped = Array.from(d3.rollup(filtered, v => Object.fromEntries(columnSums.map(col => [col, d3.sum(v, d => +parseFloat(d[col]))])), d => d.longitude, d => d.latitude))
            
            var processed = [];
            for(i in grouped){
                temp = {};
                temp['longitude'] = grouped[i][0]
                map = Array.from(grouped[i][1])
                temp['latitude'] = map[0][0];
                console.log(map)
                temp['new_hires'] = map[0][1]['workers'] - map[0][1]['previous_workers']
                processed.push(temp)
            }           
            console.log(processed)
            var Scale = d3.scaleLog()
                .domain([d3.min(processed, function(d){return d.new_hires}), d3.max(processed, function(d){return d.new_hires})])
                .range([0, 5]);

            var width = 1000;
            var height = 800;
            projection = d3.geoAlbersUsa().scale(2500).translate([1300, 300])
            path = d3.geoPath(projection)
            
            var svg = d3.select('#q4_plot').append('svg')
                    .attr('width', width)
                    .attr('height', height)

            var g = svg.append("g");    
            const statesmap = d3.json("data/us-states.json");
            statesmap.then(function(map){
                g.selectAll("path").data(map.features).enter()
                .append("path").attr("d", path)
                .attr("fill", "rgb(54, 207, 169)")
                .style("stroke", "white")
                .style("stroke-width", 1)

                svg.selectAll("myCircles")
                .data(processed)
                .enter()
                .append("circle")
                .attr("cx", function(d){ return projection([d.longitude, d.latitude])[0] })
                .attr("cy", function(d){ return projection([d.longitude, d.latitude])[1] })
                .attr("r", function(d){return Scale(d.new_hires)})
                .style("fill", "blue")
                .attr("stroke", "red")
                .attr("stroke-width", .5)
                .style("fill-opacity", .5)
            })
            
            var zoom = d3.zoom()
                    .scaleExtent([1, 8])
                    .on('zoom', function(event) {
                        g.selectAll('path')
                            .attr('transform', event.transform);
                        svg.selectAll("circle").attr("transform", event.transform)
                    })
            svg.call(zoom)

        });
    }

    var question5=function(filePath){
        d3.csv(filePath).then(function(data){
            padding = 80
            width = 700 
            height = 400 

            var svg = d3.select("#q5_plot")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
            var top_4 = d3.rollup(data, v => v.length, d => d.industry)
            var top_4 = Array.from(top_4).sort(function(a, b){
                if (a[1] < b[1]){
                    return 1;
                }
                if (a[1] > b[1]){
                    return -1;
                }
                return 0;
            }).slice(0, 4)

            var shortList = []

            for (i in top_4){
                shortList.push(top_4[i][0])
            }
            console.log(shortList)
            var filtered = data.filter(function(d){if(shortList.includes(d.industry) & d.state == "CA") return d})
            console.log(d3.group(filtered, d => d.industry))
            grouped = Array.from(d3.group(filtered, d => d.industry))
            processed = [];
            for(i in grouped){
                console.log(grouped[i])
                temp = {}
                temp['industry'] = grouped[i][0]
                vals = []
                for(j in grouped[i][1]){
                    vals.push(parseInt(grouped[i][1][j]['workers']))
                }
                vals.sort(function(a, b){
                    if (a < b){
                        return -1;
                    }
                    if (a > b){
                        return 1;
                    }
                    return 0;
                })
                temp['workers'] = vals
                temp['q1'] = d3.quantile(vals, .25)
                temp['median'] = d3.quantile(vals, .5)
                temp['q3'] = d3.quantile(vals, .75)
                temp['iqr'] = temp['q3'] - temp['q1']
                temp['min'] = temp['q1'] - 1.5 * temp['iqr']
                temp['max'] = temp['q1'] + 1.5 * temp['iqr']
                
                processed.push(temp)
            }
            console.log(processed)
            var xScale = d3.scaleBand()
                .range([padding, width - padding])
                .domain(shortList)
                .paddingInner(1)
                .paddingOuter(.5)

  
            var yScale = d3.scaleLinear()
                .domain([0,500])
                .range([height - padding, padding])
            

            const xAxis = d3.axisBottom().scale(xScale);
		    const yAxis = d3.axisLeft().scale(yScale);

            svg
    .selectAll("vertLines")
    .data(processed)
    .enter()
    .append("line")
      .attr("x1", function(d){return(xScale(d.industry))})
      .attr("x2", function(d){return(xScale(d.industry))})
      .attr("y1", function(d){console.log(yScale(d.min));return(yScale(d.min))})
      .attr("y2", function(d){return(yScale(d.max))})
      .attr("stroke", "black")
      .style("width", 40)
      var boxWidth = 80
      svg
    .selectAll("boxes")
    .data(processed)
    .enter()
    .append("rect")
        .attr("x", function(d){return(xScale(d.industry)-boxWidth/2)})
        .attr("y", function(d){return(yScale(d.q3))})
        .attr("height", function(d){return(yScale(d.q1)-yScale(d.q3))})
        .attr("width", boxWidth )
        .attr("stroke", "black")
        .style("fill", "rgb(54, 207, 169)")
    svg
        .selectAll("medianLines")
        .data(processed)
        .enter()
        .append("line")
          .attr("x1", function(d){return(xScale(d.industry)-boxWidth/2) })
          .attr("x2", function(d){return(xScale(d.industry)+boxWidth/2) })
          .attr("y1", function(d){return(yScale(d.median))})
          .attr("y2", function(d){return(yScale(d.median))})
          .attr("stroke", "black")
          .style("width", 80)

          svg.append("g").call(xAxis).attr("class", "xAxis3").attr("transform","translate(0," + (height - padding) + ")").selectAll("text")
                                                                                                    .attr("transform", "rotate(-25)")
                                                                                                    .style("text-anchor", "end")
                                                                                                    .attr("dx", "-.8em")
                                                                                                    .attr("dy", ".15em")

            svg.append("g").call(yAxis).attr("class", "yAxis3").attr("transform", "translate(" + padding + ",0)")
        });

    }
