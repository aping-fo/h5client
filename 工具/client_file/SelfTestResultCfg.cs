using CodeStage.AntiCheat.ObscuredTypes;
using ByteBuilder;

namespace Com.Game.ConfigData
{
	//z自我检测结果(工具自动生成，请勿手动修改！）
	[System.Serializable]
	public class SelfTestResultCfg : RawData
	{
		public ObscuredInt id;//ID
		public ObscuredInt category;//类型
		public int[] score;//得分
		public string result;//结果
		public string recommend;//建议

		public SelfTestResultCfg()
		{
		}

		public void Decode(BufferBuilder bb)
		{
			id = bb.Get7BitEncodeInt();
			category = bb.Get7BitEncodeInt();
			score = SerializeHelper.Get7BitEncodeInt1(bb);
			result = bb.GetString();
			recommend = bb.GetString();

			if (DeserializeHelper.OnSelfTestResultCfgDecode != null)
			{
				DeserializeHelper.OnSelfTestResultCfgDecode(this);
			}
		}

		public void Encode(BufferBuilder bb)
		{
			bb.Put7BitEncodeInt(id);
			bb.Put7BitEncodeInt(category);
			SerializeHelper.Put7BitEncodeInt1(bb,score);
			bb.PutString(result);
			bb.PutString(recommend);
		}

		public int GetId()
		{
			return this.id;
		}
	}
}
