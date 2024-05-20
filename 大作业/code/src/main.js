'use strict';
import histogram from "./histogram.js";
import * as d3 from "d3";
import csv from "./assets/YouTube.csv";

d3.csv(csv).then((data, error) => {
  if (error) {
    console.log(error);
  } else {
    histogram(data);
  };
}); 
