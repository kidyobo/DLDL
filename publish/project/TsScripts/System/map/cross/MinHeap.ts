import { Teleport } from 'System/map/cross/Teleport'

export class MinHeap {
    m_iOpenNodes: number;
    m_iCloseNodes: number;
    m_astOpenNode: Teleport[];
    m_astCloseNode: Teleport[];

    constructor() {
        this.m_astOpenNode = new Array<Teleport>();
        this.m_astCloseNode = new Array<Teleport>();
        this.m_iOpenNodes = 0;
        this.m_iCloseNodes = 0;
    }

    updateWayPointUnit(wPU: Teleport): boolean {

        let temp: Teleport;
        for (let i: number = 0; i < this.m_astOpenNode.length; i++) {

            if (this.m_astOpenNode[i].targetVSceneID == wPU.targetVSceneID && this.m_astOpenNode[i].iValueF > wPU.iValueF) {

                temp = this.m_astOpenNode[i];
                this.m_astOpenNode[i] = wPU;
                temp.resetHeap();
                temp = null;
                return true;
            }
        }

        return false;
    }

    initialize(): void {

        if (this.m_astOpenNode.length > 0)
            this.m_astOpenNode.splice(0, this.m_astOpenNode.length);

        if (this.m_astCloseNode.length > 0)
            this.m_astCloseNode.splice(0, this.m_astCloseNode.length);

        this.m_iOpenNodes = 0;
        this.m_iCloseNodes = 0;

    }

    /**
     * 弹出路径最小的点
     */
    PopHeap(): Teleport {
        if (this.m_iOpenNodes <= 0) {
            return null;
        }

        // 保存最小值
        let pstMinUnit: Teleport = this.m_astOpenNode[0];
        this.m_astCloseNode[this.m_iCloseNodes++] = pstMinUnit;

        // 比较两个子节点，将小的提升为父节点
        let iParent: number = 0;
        let iLeftChild: number, iRightChild: number;
        for (iLeftChild = (iParent << 1) + 1, iRightChild = iLeftChild + 1;
            iRightChild < this.m_iOpenNodes;
            iLeftChild = (iParent << 1) + 1, iRightChild = iLeftChild + 1) {
            if (this.m_astOpenNode[iLeftChild].iValueF < this.m_astOpenNode[iRightChild].iValueF) {
                this.m_astOpenNode[iParent] = this.m_astOpenNode[iLeftChild];
                iParent = iLeftChild;
            }
            else {
                this.m_astOpenNode[iParent] = this.m_astOpenNode[iRightChild];
                iParent = iRightChild;
            }
        }

        // 将最后一个节点填在空出来的节点上, 防止数组空洞
        if (iParent != this.m_iOpenNodes - 1) {
            this.InsertHeap(this.m_astOpenNode[--this.m_iOpenNodes], iParent);
        }

        this.m_iOpenNodes--;

        return pstMinUnit;

    }

    /**
     * 压入一个路径点
     * @param wPN
     */
    PushHeap(wPN: Teleport): boolean {
        return this.InsertHeap(wPN, this.m_iOpenNodes);
    }

    /**
     *插入堆 
     * @param pstSceneBlock
     * @param iPosition
     * @return 
     * 
     */
    private InsertHeap(wPN: Teleport, iPosition: number): boolean {
        this.m_astOpenNode[iPosition] = wPN;

        // 依次和父节点比较，如果比父节点小，则上移
        let iChild: number, iParent: number;

        for (iChild = iPosition, iParent = (iChild - 1) >> 1;
            iChild > 0;
            iChild = iParent, iParent = (iChild - 1) >> 1) {
            //进行替换
            if (this.m_astOpenNode[iChild].iValueF < this.m_astOpenNode[iParent].iValueF) {
                let tmp: Teleport = this.m_astOpenNode[iParent];
                this.m_astOpenNode[iParent] = this.m_astOpenNode[iChild];
                this.m_astOpenNode[iChild] = tmp;
            }
            else {
                break;
            }
        }

        this.m_iOpenNodes++;

        return true;
    }
}
