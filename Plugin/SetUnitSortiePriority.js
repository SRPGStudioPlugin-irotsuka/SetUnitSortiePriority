/*--------------------------------------------------------------------------
【概要】
敵，同盟軍の行動順を変更する。

【導入方法】
このファイルを Plugin に入れて出撃順を設定したいエネミーに
{setUnitSortiePriority:0}
のように設定する。

0 が最も先に行動するユニットとなる

【例】
{setUnitSortiePriority:2}

【パラメータ詳細】
setUnitSortiePriority : 出撃優先度（行動優先度）。0 が最も早く行動する。

【更新履歴】
2020/11/09 : 初版

【今後の予定】
1. デフォルト出撃順の設定機能の追加

【対応バージョン】
SRPG Studio Version:1.213

--------------------------------------------------------------------------*/

(function() {
	// ユニットの表示順変更
	var alias = UnitProvider.setupFirstUnit;
	UnitProvider.setupFirstUnit = function(unit) {
        // 先にほかの処理を終了させる（後でもいいような気はする）
        alias.call(this, unit);

        if (unit.custom.setUnitSortiePriority !== undefined) {
            var pos = unit.custom.setUnitSortiePriority;
            var unitType = unit.getUnitType();
            var list;

            if (unitType === UnitType.PLAYER) {
                list = PlayerList.getMainList();
            } else if (unitType === UnitType.ENEMY) {
                list = EnemyList.getMainList();
            } else if (unitType === UnitType.ALLY) {
                list = AllyList.getMainList();
            }

            // 現在の UNIT の位置を探索
            var unitOrgPos;
            for (i = list.getCount() - 1; i >= 0; i--) {
                if (list.getData(i).getId() === unit.getId()) {
                    unitOrgPos = i;
                    break;
                }
            }

            // unitOrgPos より前はソート済みで、この位置より後は未ソートとなっている
            for (i = unitOrgPos; i > 0; i--) {
                // 後ろから前へ一つずつ移動させる
                var srcUnit = list.getData(i); // uint と同じものを指す
                var destUnit = list.getData(i - 1);

                // destUnit が setUnitSortiePriority を持ち，dest の位置より前を指定されている場合終了
                if (destUnit.custom.setUnitSortiePriority != undefined &&
                    destUnit.custom.setUnitSortiePriority <= pos) {
                    break;
                }

                list.exchangeUnit(srcUnit, destUnit);
            }
        }
    }
})();