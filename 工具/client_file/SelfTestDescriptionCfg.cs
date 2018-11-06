using CodeStage.AntiCheat.ObscuredTypes;
using ByteBuilder;

namespace Com.Game.ConfigData
{
	//z自我检测分类描述(工具自动生成，请勿手动修改！）
	[System.Serializable]
	public class SelfTestDescriptionCfg : RawData
	{
		public ObscuredInt id;//ID
		public string name;//体质名称
		public string desc1;//总体特征
		public string desc2;//形体特征
		public string desc3;//常见表现
		public string desc4;//心理特征
		public string desc5;//发病倾向
		public string desc6;//对外界环境适应能力

		public SelfTestDescriptionCfg()
		{
		}

		public void Decode(BufferBuilder bb)
		{
			id = bb.Get7BitEncodeInt();
			name = bb.GetString();
			desc1 = bb.GetString();
			desc2 = bb.GetString();
			desc3 = bb.GetString();
			desc4 = bb.GetString();
			desc5 = bb.GetString();
			desc6 = bb.GetString();

			if (DeserializeHelper.OnSelfTestDescriptionCfgDecode != null)
			{
				DeserializeHelper.OnSelfTestDescriptionCfgDecode(this);
			}
		}

		public void Encode(BufferBuilder bb)
		{
			bb.Put7BitEncodeInt(id);
			bb.PutString(name);
			bb.PutString(desc1);
			bb.PutString(desc2);
			bb.PutString(desc3);
			bb.PutString(desc4);
			bb.PutString(desc5);
			bb.PutString(desc6);
		}

		public int GetId()
		{
			return this.id;
		}
	}
}
