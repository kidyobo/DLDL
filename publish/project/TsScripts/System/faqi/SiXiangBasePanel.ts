import { FaQiBasePanel } from 'System/faqi/FaQiBasePanel'

export abstract class SiXiangBasePanel extends FaQiBasePanel {
    protected mergeProps(props: GameConfig.EquipPropAtt[], multiple: number, outArr: GameConfig.EquipPropAtt[], outMap: { [propId: number]: GameConfig.EquipPropAtt }) {
        for (let p of props) {
            if (p.m_ucPropId > 0 && p.m_ucPropValue > 0) {
                let propValue = outMap[p.m_ucPropId];
                let v = Math.floor(p.m_ucPropValue * multiple);
                if (null == propValue) {
                    outMap[p.m_ucPropId] = propValue = { m_ucPropId: p.m_ucPropId, m_ucPropValue: v };
                    outArr.push(propValue);
                } else {
                    propValue.m_ucPropValue += v;
                }
            }
        }
    }

    protected mergeHaloProps(props: GameConfig.EquipPropAtt[], faQiCfg: GameConfig.FaQiCfgM, soulCfg: GameConfig.FaQiZhuHunCfgM, outArr: GameConfig.EquipPropAtt[], outMap: { [propId: number]: GameConfig.EquipPropAtt }) {
        for (let p of props) {
            if (p.m_ucPropId > 0 && p.m_ucPropValue > 0) {
                let fqv = 0;
                for (let fqp of faQiCfg.m_astAddedProp) {
                    if (fqp.m_ucPropId == p.m_ucPropId) {
                        fqv = fqp.m_ucPropValue;
                        break;
                    }
                }
                if (null != soulCfg) {
                    for (let sqp of soulCfg.m_astProp) {
                        if (sqp.m_ucPropId == p.m_ucPropId) {
                            fqv += sqp.m_ucPropValue;
                            break;
                        }
                    }
                }
                let addValue = Math.floor(fqv * p.m_ucPropValue / 10000);
                if (addValue > 0) {
                    let propValue = outMap[p.m_ucPropId];
                    if (null == propValue) {
                        outMap[p.m_ucPropId] = propValue = { m_ucPropId: p.m_ucPropId, m_ucPropValue: addValue };
                        outArr.push(propValue);
                    } else {
                        propValue.m_ucPropValue += addValue;
                    }
                }
            }
        }
    } 
}