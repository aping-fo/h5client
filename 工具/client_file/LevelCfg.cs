using CodeStage.AntiCheat.ObscuredTypes;
using ByteBuilder;

namespace Com.Game.ConfigData
{
	//d等级(工具自动生成，请勿手动修改！）
	[System.Serializable]
	public class LevelCfg : RawData
	{
		public ObscuredInt id;//ID
		public ObscuredInt level;//等级
		public string levelName;//等级称号
		public ObscuredInt levelUpScore;//升级积分
		public ObscuredInt rightScore;//答对积分
		public ObscuredInt wrongScore;//答错积分
		public ObscuredInt difficultyMin;//派题难度下限
		public ObscuredInt difficultyMax;//派题难度上限

		public LevelCfg()
		{
		}

		public void Decode(BufferBuilder bb)
		{
			id = bb.Get7BitEncodeInt();
			level = bb.Get7BitEncodeInt();
			levelName = bb.GetString();
			levelUpScore = bb.Get7BitEncodeInt();
			rightScore = bb.Get7BitEncodeInt();
			wrongScore = bb.Get7BitEncodeInt();
			difficultyMin = bb.Get7BitEncodeInt();
			difficultyMax = bb.Get7BitEncodeInt();

			if (DeserializeHelper.OnLevelCfgDecode != null)
			{
				DeserializeHelper.OnLevelCfgDecode(this);
			}
		}

		public void Encode(BufferBuilder bb)
		{
			bb.Put7BitEncodeInt(id);
			bb.Put7BitEncodeInt(level);
			bb.PutString(levelName);
			bb.Put7BitEncodeInt(levelUpScore);
			bb.Put7BitEncodeInt(rightScore);
			bb.Put7BitEncodeInt(wrongScore);
			bb.Put7BitEncodeInt(difficultyMin);
			bb.Put7BitEncodeInt(difficultyMax);
		}

		public int GetId()
		{
			return this.id;
		}
	}
}
