using UnityEngine;
using System.Collections;

public class Besizer : MonoBehaviour {

    /// <summary>
    /// Event delegates called when the animation finishes.
    /// </summary>
    [HideInInspector]
    public System.Action onFinished = null;
    public GameObject target;
    public float speed = 10;
    private float distanceToTarget;
    private bool move = true;
    public float angelmodu = 30;


    // Use this for initialization
    void Start () {
        
    }
    IEnumerator Shoot()
    {
        while (move)
        {
            var position = this.transform.position;
            Vector3 targetPos = target.transform.position;
            this.transform.right = targetPos - position;
            float angle = Mathf.Min(1, Vector3.Distance(position, targetPos) / distanceToTarget) * angelmodu;
            var v1 = this.transform.localRotation.eulerAngles;
            var v2 = new Vector3(0, 0, Mathf.Clamp(angle, -42, 42));
            this.transform.localRotation = Quaternion.Euler(v1 + v2);
            float currentDist = Vector3.Distance(position, target.transform.position);
            this.transform.Translate(Vector3.right * Mathf.Min(speed * Time.deltaTime, currentDist));
            if (currentDist < 0.1f)
            {
                move = false;
                if (onFinished != null)
                {
                    var cache = onFinished;
                    onFinished = null;
                    cache();
                }
            }
            yield return null;
        }
    }

    public void Play()
    {
        distanceToTarget = Vector3.Distance(this.transform.position, target.transform.position);
        move = true;
        StartCoroutine(Shoot());
    }
}
