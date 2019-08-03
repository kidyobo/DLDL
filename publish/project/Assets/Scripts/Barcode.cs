using UnityEngine;
using ZXing;
using ZXing.QrCode;
using System.Threading;
using System.Collections.Generic;
public class Barcode : MonoBehaviour
{
    private static bool isQuit;
    public static Texture2D EncodeString(string text)
    {
        var encoded = new Texture2D(256, 256, TextureFormat.RGBA32, false);
        var writer = new BarcodeWriter
        {
            Format = BarcodeFormat.QR_CODE,
            Options = new QrCodeEncodingOptions
            {
                DisableECI = true,
                CharacterSet = "UTF-8",
                Height = 256,
                Width = 256,
            }
        };
        var colors = writer.Write(text);
        encoded.SetPixels32(colors);
        encoded.Apply(false, true);
        return encoded;
    }
    private WebCamTexture camTexture;
    private Color32[] c;
    public static int W = 640;
    public static int H = 480;

    int realW = 640;
    int realH = 480;
    private Thread qrThread = null;
    private string LastResult;
    public Texture texture
    {
        get
        {
            return camTexture;
        }
    }
    public bool isFlip
    {
        get
        {
            return camTexture.videoVerticallyMirrored;
        }
    }

    public Transform imageTransform;

    public System.Action<string> onGetResult = null;
    bool isPause = false;

    void OnEnable()
    {
        isPause = false;
        if (camTexture != null)
        {
            camTexture.Play();
        }
    }

    void OnDisable()
    {
        isPause = true;
        if (camTexture != null)
        {
            camTexture.Stop();
        }
        c = null;
    }

    void OnDestroy()
    {
        isQuit = true;
        qrThread.Abort();
        camTexture.Stop();
        GameObject.DestroyImmediate(camTexture);
        camTexture = null;
    }
    // It's better to stop the thread by itself rather than abort it.
    void OnApplicationQuit()
    {
        isQuit = true;
    }

    void Awake()
    {
        isQuit = false;
        camTexture = new WebCamTexture();
        camTexture.requestedHeight = H;
        camTexture.requestedWidth = W;
        OnEnable();
        qrThread = new Thread(DecodeQR);
        qrThread.Start();
    }

    void Update()
    {
        if (imageTransform != null)
        {
            float scaleY = camTexture.videoVerticallyMirrored ? -1.0f : 1.0f;
            imageTransform.localScale = new Vector3(1, scaleY, 1);
        }
        if (LastResult != null)
        {
            if (onGetResult != null)
            {
                var old = onGetResult;
                onGetResult = null;
                old(LastResult);
            }
            LastResult = null;
        }
        else if (c == null)
        {
            c = camTexture.GetPixels32();
            realH = camTexture.height;
            realW = camTexture.width;
        }
    }

    void DecodeQR()
    {
        // create a reader with a custom luminance source
        var barcodeReader = new BarcodeReader { AutoRotate = false };
        barcodeReader.Options = new ZXing.Common.DecodingOptions
        {
            TryHarder = false
        };
        while (true)
        {
            if (isQuit)
                break;
            if (isPause)
            {
                Thread.Sleep(200);
                continue;
            }
            try
            {
                // decode the current frame
                var result = barcodeReader.Decode(c, realW, realH);
                c = null;
                if (result != null)
                {
                    LastResult = result.Text;
                }
                // Sleep a little bit and set the signal to get the next frame
                Thread.Sleep(200);
            }
            catch
            {
            }
        }
    }
}