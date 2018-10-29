using CodeStage.AntiCheat.ObscuredTypes;
using ByteBuilder;

namespace Com.Game.ConfigData
{
	//t题库(工具自动生成，请勿手动修改！）
	[System.Serializable]
	public class QuestionCfg : RawData
	{
		public ObscuredInt id;//ID
		public string content;//题目内容
		public string contentImgUrl;//题目图片路径
		public string[] options;//选项
		public ObscuredInt answerIndex;//答案
		public ObscuredInt catergory;//分类
		public ObscuredInt difficulty;//难度
		public string explain;//解释

		public QuestionCfg()
		{
		}

		public void Decode(BufferBuilder bb)
		{
			id = bb.Get7BitEncodeInt();
			content = bb.GetString();
			contentImgUrl = bb.GetString();
			options = SerializeHelper.GetString1(bb);
			answerIndex = bb.Get7BitEncodeInt();
			catergory = bb.Get7BitEncodeInt();
			difficulty = bb.Get7BitEncodeInt();
			explain = bb.GetString();

			if (DeserializeHelper.OnQuestionCfgDecode != null)
			{
				DeserializeHelper.OnQuestionCfgDecode(this);
			}
		}

		public void Encode(BufferBuilder bb)
		{
			bb.Put7BitEncodeInt(id);
			bb.PutString(content);
			bb.PutString(contentImgUrl);
			SerializeHelper.PutString1(bb,options);
			bb.Put7BitEncodeInt(answerIndex);
			bb.Put7BitEncodeInt(catergory);
			bb.Put7BitEncodeInt(difficulty);
			bb.PutString(explain);
		}

		public int GetId()
		{
			return this.id;
		}
	}
}
