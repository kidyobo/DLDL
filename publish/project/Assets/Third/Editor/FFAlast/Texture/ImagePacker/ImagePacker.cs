using System;
using System.Collections.Generic;
using UnityEngine;

class ImagePacker
{
    // various properties of the resulting image
    private bool requirePow2, requireSquare;
    private int padding;
    private int outputWidth, outputHeight;

    // the input list of image files
    private List<Texture2D> images;

    // some dictionaries to hold the image sizes and destination rectangles
    private readonly Dictionary<Texture2D, Vector2> imageSizes = new Dictionary<Texture2D, Vector2>();
    private readonly Dictionary<Texture2D, Rect> imagePlacement = new Dictionary<Texture2D, Rect>();

    /// <summary>
    /// Packs a collection of images into a single image.
    /// </summary>
    /// <param name="imageFiles">The list of file paths of the images to be combined.</param>
    /// <param name="requirePowerOfTwo">Whether or not the output image must have a power of two size.</param>
    /// <param name="requireSquareImage">Whether or not the output image must be a square.</param>
    /// <param name="maximumWidth">The maximum width of the output image.</param>
    /// <param name="maximumHeight">The maximum height of the output image.</param>
    /// <param name="imagePadding">The amount of blank space to insert in between individual images.</param>
    /// <param name="generateMap">Whether or not to generate the map dictionary.</param>
    /// <param name="outputImage">The resulting output image.</param>
    /// <param name="outputMap">The resulting output map of placement rectangles for the images.</param>
    /// <returns>0 if the packing was successful, error code otherwise.</returns>
    public Rect[] PackImage(
        Texture2D targetImage,
        Texture2D[] imageList,
        bool requirePowerOfTwo,
        bool requireSquareImage,
        int maximumWidth,
        int maximumHeight,
        int imagePadding)
    {
        this.images = new List<Texture2D>(imageList);
        requirePow2 = requirePowerOfTwo;
        requireSquare = requireSquareImage;
        outputWidth = maximumWidth;
        outputHeight = maximumHeight;
        padding = imagePadding;


        // make sure our dictionaries are cleared before starting
        imageSizes.Clear();
        imagePlacement.Clear();

        // get the sizes of all the images
        foreach (var image in images)
        {
            imageSizes.Add(image, new Vector2(image.width, image.height));
        }

        // sort our files by file size so we place large sprites first
        images.Sort(
            (f1, f2) =>
            {
                Vector2 b1 = imageSizes[f1];
                Vector2 b2 = imageSizes[f2];

                int c = -b1.x.CompareTo(b2.x);
                if (c != 0)
                    return c;

                c = -b1.y.CompareTo(b2.y);
                if (c != 0)
                    return c;

                return f1.name.CompareTo(f2.name);
            });

        // try to pack the images
        if (!PackImageRectangles())
            return null;

        // make our output image
        if (!CreateOutputImage(targetImage))
            return null;

        // go through our image placements and replace the width/height found in there with
        // each image's actual width/height (since the ones in imagePlacement will have padding)
        List<Rect> values = new List<Rect>(imageList.Length);
        foreach (var k in imageList)
        {
            // get the actual size
            Vector2 s = imageSizes[k];

            // get the placement rectangle
            Rect r = imagePlacement[k];
            r.x /= outputWidth;
            r.y /= outputHeight;
            // set the proper size
            r.width = s.x / outputWidth;
            r.height = s.y / outputHeight;

            // insert back into the dictionary
            imagePlacement[k] = r;
            values.Add(r);
        }
        // clear our dictionaries just to free up some memory
        imageSizes.Clear();
        imagePlacement.Clear();

        return values.ToArray();
    }

    // This method does some trickery type stuff where we perform the TestPackingImages method over and over, 
    // trying to reduce the image size until we have found the smallest possible image we can fit.
    private bool PackImageRectangles()
    {
        // create a dictionary for our test image placements
        Dictionary<Texture2D, Rect> testImagePlacement = new Dictionary<Texture2D, Rect>();

        // get the size of our smallest image
        int smallestWidth = int.MaxValue;
        int smallestHeight = int.MaxValue;
        foreach (var size in imageSizes)
        {
            smallestWidth = Math.Min(smallestWidth, (int)size.Value.x);
            smallestHeight = Math.Min(smallestHeight, (int)size.Value.y);
        }

        // we need a couple values for testing
        int testWidth = outputWidth;
        int testHeight = outputHeight;

        bool shrinkVertical = false;

        // just keep looping...
        while (true)
        {
            // make sure our test dictionary is empty
            testImagePlacement.Clear();

            // try to pack the images into our current test size
            if (!TestPackingImages(testWidth, testHeight, testImagePlacement))
            {
                // if that failed...

                // if we have no images in imagePlacement, i.e. we've never succeeded at PackImages,
                // show an error and return false since there is no way to fit the images into our
                // maximum size texture
                if (imagePlacement.Count == 0)
                    return false;

                // otherwise return true to use our last good results
                if (shrinkVertical)
                    return true;

                shrinkVertical = true;
                testWidth += smallestWidth + padding + padding;
                testHeight += smallestHeight + padding + padding;
                continue;
            }

            // clear the imagePlacement dictionary and add our test results in
            imagePlacement.Clear();
            foreach (var pair in testImagePlacement)
                imagePlacement.Add(pair.Key, pair.Value);

            // figure out the smallest bitmap that will hold all the images
            testWidth = testHeight = 0;
            foreach (var pair in imagePlacement)
            {
                testWidth = Math.Max(testWidth, (int)pair.Value.xMax);
                testHeight = Math.Max(testHeight, (int)pair.Value.yMax);
            }

            // subtract the extra padding on the right and bottom
            if (!shrinkVertical)
                testWidth -= padding;
            testHeight -= padding;

            // if we require a power of two texture, find the next power of two that can fit this image
            if (requirePow2)
            {
                testWidth = MiscHelper.FindNextPowerOfTwo(testWidth);
                testHeight = MiscHelper.FindNextPowerOfTwo(testHeight);
            }

            // if we require a square texture, set the width and height to the larger of the two
            if (requireSquare)
            {
                int max = Math.Max(testWidth, testHeight);
                testWidth = testHeight = max;
            }

            // if the test results are the same as our last output results, we've reached an optimal size,
            // so we can just be done
            if (testWidth == outputWidth && testHeight == outputHeight)
            {
                if (shrinkVertical)
                    return true;

                shrinkVertical = true;
            }

            // save the test results as our last known good results
            outputWidth = testWidth;
            outputHeight = testHeight;

            // subtract the smallest image size out for the next test iteration
            if (!shrinkVertical)
                testWidth -= smallestWidth;
            testHeight -= smallestHeight;
        }
    }

    private bool TestPackingImages(int testWidth, int testHeight, Dictionary<Texture2D, Rect> testImagePlacement)
    {
        // create the rectangle packer
        ArevaloRectanglePacker rectanglePacker = new ArevaloRectanglePacker(testWidth, testHeight);

        foreach (var image in images)
        {
            // get the bitmap for this file
            Vector2 size = imageSizes[image];

            // pack the image
            Vector2 origin;
            if (!rectanglePacker.TryPack((int)(size.x + padding), (int)(size.y + padding), out origin))
            {
                return false;
            }

            // add the destination rectangle to our dictionary
            testImagePlacement.Add(image, new Rect(origin.x, origin.y, size.x + padding, size.y + padding));
        }

        return true;
    }

    private bool CreateOutputImage(Texture2D target)
    {
        try
        {
            target.Resize(outputWidth, outputHeight);
            for (int i = 0; i < outputHeight; i++)
            {
                for (int j = 0; j < outputWidth; j++)
                {
                    target.SetPixel(j, i, new Color(0, 0, 0, 0));
                }
            }
            // draw all the images into the output image
            foreach (var image in images)
            {
                Rect location = imagePlacement[image];
                // copy pixels over to avoid antialiasing or any other side effects of drawing
                // the subimages to the output image using Graphics
                target.SetPixels((int)location.x, (int)location.y, image.width, image.height, image.GetPixels());
            }
            return true;
        }
        catch
        {
            return false;
        }
    }
}