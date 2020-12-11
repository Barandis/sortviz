<!--
 Copyright (c) 2020 Thomas J. Otterson
 
 This software is released under the MIT License.
 https://opensource.org/licenses/MIT
-->

Playing around with visualizations of sorting algorithms.

These visualizations display a disparity circle (for now, I might add other visualizations if I feel like it). The pixels' properties represent three properties of the numbers they represent:

* The color represents the actual **value**. This starts at 0 with the reddest pixel and goes through the color wheel (using `hsl(x, 100%, 50%)`) through green at 1/3 of the way through the set of numebrs, blue at 2/3, and then back to red at the maximum value.
* The angle of the pixel represents its **index** in the array. The pixel directly to the right of center is at index 0, moving around clockwise to a quarter of the way through the array at directly down, halfway through at directly left, thre quarters of the way through at directly up, and back to the max index at (almost) directly right.
* The distance the pixel is from the center represents the **disparity**. This is a measure of the distance between the index where the value *is* and where it *wants to be*. The value that, when sorted, is at index 0 will be on the edge of the circle only when it actually *is* at index 0. If it's halfway as far as it can be from its desired index, it'll be halfway from the center to the edge, and at the maximum distance, that pixel will be at the center. This is represented circularly; a value that wants to be at index 0 but is at the maximum index is actually only one index away from where it wants to be, and it'll appear quite close to the edge.

The upshot of these three values is that, when sorted, the array will be a perfect circle of colors through the color wheel, from red to the right at 0 degrees, green at 120 degrees, blue at 240 degrees, and red again at 360 degrees.

The sorts represented right now, in order, are

1. Bubble sort
2. Insertion sort
3. Selection sort
4. Heap sort
5. Merge sort
6. Shell sort
7. Quick sort
8. Bucket sort

Each is done with an array of 1500 numbers. They are run at different speeds to keep all of the visualizations fairly close to each other in length; this requires speeding some of the sorts up quite a lot. This is meant to show what a sort looks like, not how fast it is compared to another.

At the beginning, the circle forms as the array is initialized and filled with numbners, and there is a shuffle before each sort.

See it all at [the github.io page for this project](https://barandis.github.io/sortviz/).
