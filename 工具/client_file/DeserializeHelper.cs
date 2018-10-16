using System.Collections.Generic;
using Com.Game.ConfigData;
using Protocol;
using CodeStage.AntiCheat.ObscuredTypes;
using ByteBuilder;
using System.Linq;

namespace Com.Game.ConfigData
{
	//(工具自动生成，请勿手动修改！）
	[System.Serializable]
	public class DeserializeHelper
	{

		public static Dictionary<string,Dictionary<int,object>> Deserialize(BufferBuilder bb)
		{
			Dictionary<string,Dictionary<int,object>> valueDicts= new Dictionary<string,Dictionary<int,object>>();
			Dictionary<int,object> valueDict;
			valueDict = Deserialize("LevelCfg", bb);
			valueDicts.Add("LevelCfg",valueDict);
			valueDict = Deserialize("QuestionCfg", bb);
			valueDicts.Add("QuestionCfg",valueDict);

			return valueDicts;
		}

		delegate object[] DeserializeDelegate(BufferBuilder bb);
		static Dictionary<string, DeserializeDelegate> g_DeserializeHandler = new Dictionary<string, DeserializeDelegate>()
		{
			{ "LevelCfg",  (bb) => { return SerializeHelper.GetLevelCfg1(bb); } },
			{ "QuestionCfg",  (bb) => { return SerializeHelper.GetQuestionCfg1(bb); } },
		};

		public static Dictionary<int, object> Deserialize(string type, BufferBuilder bb)
		{
			if (g_DeserializeHandler.ContainsKey(type))
			{
				object[] datas = (g_DeserializeHandler[type](bb));
				if (datas != null && datas.Length > 0)
				{
					bool isGlobalConfig = type.Contains("GlobalConfig");
					Dictionary<int, object> valueDict = new Dictionary<int, object>();
					for (int i = 0; i < datas.Length; ++i)
					{
						RawData dataType = (RawData)datas[i];
						if (dataType != null)
						{
							int id = dataType.GetId();
							if (isGlobalConfig)
								id = i + 1;
							valueDict.Add(id, dataType);
						}
					}
					return valueDict;
				}
			}
			return null;
		}

		static Dictionary<string, string> g_SerializeTrueType = new Dictionary<string, string>()
		{
			{ "levelcfg", "LevelCfg"},
			{ "questioncfg", "QuestionCfg"},
		};

		public static string GetSerializeTrueType(string type)
		{
			if (!g_SerializeTrueType.ContainsKey(type))
				return string.Empty;
			return g_SerializeTrueType[type];
		}


#if UNITY_EDITOR
		delegate void SerializeDelegate(BufferBuilder bb, object[] datas);
		static Dictionary<string, SerializeDelegate> g_SerializeHandler = new Dictionary<string, SerializeDelegate>()
		{
			{ "LevelCfg",  (bb, datas) => { SerializeHelper.PutLevelCfg1(bb, (LevelCfg[])datas); } },
			{ "QuestionCfg",  (bb, datas) => { SerializeHelper.PutQuestionCfg1(bb, (QuestionCfg[])datas); } },
		};

		public static void Serialize(string type, BufferBuilder bb, object[] datas)
		{
			if (!g_SerializeHandler.ContainsKey(type))
				return;
			g_SerializeHandler[type](bb, datas);
		}
		static object[] Deserialize2(string type, BufferBuilder bb)
		{
			if (!g_DeserializeHandler.ContainsKey(type))
				return null;
			return g_DeserializeHandler[type](bb);
		}
		public static Dictionary<string, object[]> Deserialize2(BufferBuilder bb)
		{
			Dictionary<string,object[]> valueDicts= new Dictionary<string,object[]>();
			object[] rawDatas = null;
			rawDatas = Deserialize2("LevelCfg", bb);
			valueDicts.Add("LevelCfg",rawDatas);
			rawDatas = Deserialize2("QuestionCfg", bb);
			valueDicts.Add("QuestionCfg",rawDatas);
			return valueDicts;
		}
#endif

		public delegate void LevelCfgDecodeHandler(LevelCfg data);
		public static LevelCfgDecodeHandler OnLevelCfgDecode = null;
		public delegate void QuestionCfgDecodeHandler(QuestionCfg data);
		public static QuestionCfgDecodeHandler OnQuestionCfgDecode = null;
	}
}
